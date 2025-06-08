import os
import sys
import uvicorn

if __name__ == "__main__":
    print(f"Python executable: {sys.executable}")
    print(f"Working directory: {os.getcwd()}")
    print(f"Environment variables: {os.environ.get('PATH', '')}")
    
    # Iniciar el servidor Uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=1
    )
