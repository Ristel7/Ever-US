import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_IN = int(os.getenv("JWT_EXPIRES_IN", 7))


def generate_token(user_id):
#Generate JWT for a user.
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=JWT_EXPIRES_IN),
        "iat": datetime.utcnow()
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )

    return token



def verify_token(token):
#Verify JWT and return payload.
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        return {
            "success": True,
            "data": payload
        }

    except jwt.ExpiredSignatureError:
        return {
            "success": False,
            "message": "Token has expired"
        }

    except jwt.InvalidTokenError:
        return {
            "success": False,
            "message": "Invalid token"
        }

