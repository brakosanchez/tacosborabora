# Scripts de Seguridad para Tacos Bora Bora

Este directorio contiene scripts útiles para gestionar la seguridad de la aplicación Tacos Bora Bora.

## Scripts Disponibles

### `generate_env.py`

Genera un archivo `.env` seguro con valores aleatorios para las claves secretas.

**Uso:**
```bash
python scripts/generate_env.py
```

Este script:
1. Lee el archivo `.env.example`
2. Genera valores seguros para las claves secretas
3. Crea un nuevo archivo `.env` con estos valores

### `check_security.py`

Verifica la configuración de seguridad del proyecto.

**Uso:**
```bash
python scripts/check_security.py
```

Este script verifica:
- Archivos de configuración y sus permisos
- Variables de entorno críticas
- Dependencias con vulnerabilidades conocidas
- Configuración de encabezados de seguridad HTTP

**Requisitos:**
- Python 3.7+
- Opcional: `pip-audit` o `safety` para verificación de dependencias

### Configuración Recomendada

1. **Permisos de Archivos:**
   - `.env` debe tener permisos 600 (solo lectura/escritura para el propietario)
   - Los directorios deben tener permisos 755
   - Los archivos Python deben tener permisos 644

2. **Variables de Entorno Críticas:**
   - `SECRET_KEY`: Clave secreta para firmar cookies y hashes
   - `JWT_SECRET`: Clave para firmar tokens JWT
   - `CSRF_SECRET_KEY`: Clave para protección CSRF
   - `MONGODB_URI`: URI de conexión a MongoDB

3. **Dependencias de Seguridad Recomendadas:**
   ```bash
   pip install pip-audit safety bandit
   ```

## Próximos Pasos

1. Ejecuta `generate_env.py` para crear tu archivo `.env`
2. Configura las variables según tu entorno
3. Ejecuta `check_security.py` para verificar la configuración
4. Corrige cualquier advertencia o error reportado

## Recursos Adicionales

- [Guía de Seguridad de Django](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Guía de Seguridad de Python](https://docs.python-guide.org/writing/security/)
