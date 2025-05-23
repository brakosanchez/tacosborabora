import requests
import sys

def test_login():
    url = "http://localhost:8000/api/auth/login"
    data = {
        "username": "admin@tacosborabora.com",
        "password": "changeme"
    }
    
    try:
        response = requests.post(
            url,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        print(f"Status Code: {response.status_code}")
        print("Response:", response.json())
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Probando endpoint de login...")
    success = test_login()
    sys.exit(0 if success else 1)
