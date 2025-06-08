"""
Middleware de seguridad para la aplicación FastAPI.
Incluye protección contra CSRF, inyección SQL, XSS, etc.
"""
import re
import time
from typing import Callable, List, Pattern, Dict, Any, Optional
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse

class SecurityMiddleware:
    def __init__(
        self,
        app,
        csrf_protection: bool = True,
        xss_protection: bool = True,
        sql_injection_protection: bool = True,
        rate_limiting: bool = True,
        max_requests: int = 100,
        time_window: int = 900  # 15 minutos en segundos
    ):
        self.app = app
        self.csrf_protection = csrf_protection
        self.xss_protection = xss_protection
        self.sql_injection_protection = sql_injection_protection
        self.rate_limiting = rate_limiting
        self.max_requests = max_requests
        self.time_window = time_window
        self.request_counts: Dict[str, List[float]] = {}
        
        # Expresiones regulares para detección de inyección SQL
        self.sql_keywords = [
            r'\b(union|select|insert|update|delete|drop|alter|create|truncate)\b',
            r'\b(and|or|not)\s*[=(]',
            r'--|#|/\\*',
            r'\b(exec|execute|xp_cmdshell|sp_configure)\b',
            r'\b(load_file|outfile|dumpfile)\s*\('
        ]
        
        # Expresiones regulares para detección de XSS
        self.xss_patterns = [
            r'<script[^>]*>.*<\/script>',
            r'on\w+\s*=',
            r'javascript:',
            r'vbscript:',
            r'<\?',
            r'<\/?(applet|meta|xml|blink|link|style|script|embed|object|iframe|frame|frameset|ilayer|layer|bgsound|title|base)',
            r'\b(document\.|window\.|eval\(|data:)'
        ]
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        
        request = Request(scope, receive=receive)
        client_ip = request.client.host if request.client else 'unknown'
        
        # Verificación de límite de tasa
        if self.rate_limiting and not await self.check_rate_limit(client_ip):
            response = JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Demasiadas solicitudes. Por favor, intente más tarde."}
            )
            await response(scope, receive, send)
            return
        
        # Verificación CSRF para métodos que modifican datos
        if self.csrf_protection and request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            if not await self.verify_csrf_token(request):
                response = JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={"detail": "Token CSRF inválido o faltante"}
                )
                await response(scope, receive, send)
                return
        
        # Verificación de inyección SQL
        if self.sql_injection_protection and not await self.check_sql_injection(request):
            response = JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Solicitud sospechosa detectada"}
            )
            await response(scope, receive, send)
            return
        
        # Verificación de XSS
        if self.xss_protection and not await self.check_xss(request):
            response = JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Entrada no permitida detectada"}
            )
            await response(scope, receive, send)
            return
        
        # Si todo está bien, continuar con la solicitud
        return await self.app(scope, receive, send)
    
    async def check_rate_limit(self, client_ip: str) -> bool:
        """Verifica si el cliente ha excedido el límite de solicitudes."""
        current_time = time.time()
        
        # Eliminar registros más antiguos que la ventana de tiempo
        if client_ip in self.request_counts:
            self.request_counts[client_ip] = [
                t for t in self.request_counts[client_ip]
                if current_time - t < self.time_window
            ]
        
        # Contar solicitudes en la ventana de tiempo actual
        request_times = self.request_counts.get(client_ip, [])
        
        if len(request_times) >= self.max_requests:
            return False
        
        # Agregar la solicitud actual
        request_times.append(current_time)
        self.request_counts[client_ip] = request_times
        return True
    
    async def verify_csrf_token(self, request: Request) -> bool:
        """Verifica el token CSRF en la solicitud."""
        # Obtener el token de la cookie y del encabezado
        csrf_token_cookie = request.cookies.get('csrftoken')
        csrf_token_header = request.headers.get('X-CSRF-Token')
        
        # Si no hay token en la cookie, rechazar
        if not csrf_token_cookie:
            return False
        
        # Para métodos seguros (GET, HEAD, OPTIONS, TRACE), no se requiere verificación
        if request.method in ["GET", "HEAD", "OPTIONS", "TRACE"]:
            return True
        
        # Verificar que el token del encabezado coincida con la cookie
        return csrf_token_header == csrf_token_cookie
    
    async def check_sql_injection(self, request: Request) -> bool:
        """Verifica si la solicitud contiene intentos de inyección SQL."""
        # Verificar parámetros de consulta
        for param in request.query_params.values():
            if self._matches_patterns(str(param), self.sql_keywords):
                return False
        
        # Verificar datos del formulario
        try:
            form_data = await request.form()
            for value in form_data.values():
                if isinstance(value, str) and self._matches_patterns(value, self.sql_keywords):
                    return False
        except Exception:
            pass
        
        # Verificar JSON
        try:
            json_data = await request.json()
            if self._check_dict_for_sql(json_data):
                return False
        except Exception:
            pass
            
        return True
    
    def _check_dict_for_sql(self, data: Any) -> bool:
        """Verifica recursivamente un diccionario en busca de patrones SQL."""
        if isinstance(data, dict):
            for value in data.values():
                if self._check_dict_for_sql(value):
                    return True
        elif isinstance(data, (list, tuple)):
            for item in data:
                if self._check_dict_for_sql(item):
                    return True
        elif isinstance(data, str):
            return self._matches_patterns(data, self.sql_keywords)
        return False
    
    async def check_xss(self, request: Request) -> bool:
        """Verifica si la solicitud contiene intentos de XSS."""
        # Verificar parámetros de consulta
        for param in request.query_params.values():
            if self._matches_patterns(str(param), self.xss_patterns):
                return False
        
        # Verificar datos del formulario
        try:
            form_data = await request.form()
            for value in form_data.values():
                if isinstance(value, str) and self._matches_patterns(value, self.xss_patterns):
                    return False
        except Exception:
            pass
        
        # Verificar JSON
        try:
            json_data = await request.json()
            if self._check_dict_for_xss(json_data):
                return False
        except Exception:
            pass
            
        return True
    
    def _check_dict_for_xss(self, data: Any) -> bool:
        """Verifica recursivamente un diccionario en busca de patrones XSS."""
        if isinstance(data, dict):
            for value in data.values():
                if self._check_dict_for_xss(value):
                    return True
        elif isinstance(data, (list, tuple)):
            for item in data:
                if self._check_dict_for_xss(item):
                    return True
        elif isinstance(data, str):
            return self._matches_patterns(data, self.xss_patterns)
        return False
    
    def _matches_patterns(self, text: str, patterns: List[str]) -> bool:
        """Verifica si el texto coincide con alguno de los patrones."""
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE | re.DOTALL):
                return True
        return False

# Función para generar un token CSRF seguro
def generate_csrf_token() -> str:
    """Genera un token CSRF seguro."""
    return secrets.token_urlsafe(32)
