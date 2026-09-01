import bcrypt
import re
from pymongo.errors import DuplicateKeyError
from models.user import users_collection
from utils.jwt_handler import generate_token

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _normalize_email(email):
    return email.strip().lower() if isinstance(email, str) else None


def _validate_credentials(email, password):
    normalized_email = _normalize_email(email)
    if not normalized_email or not EMAIL_PATTERN.fullmatch(normalized_email):
        return None, "Please provide a valid email address"
    if not isinstance(password, str) or not password.strip():
        return None, "Password is required"
    return normalized_email, None


def register_user(name, email, password):

    normalized_email, error = _validate_credentials(email, password)
    if error:
        return {"success": False, "message": error}
    if not isinstance(name, str) or not name.strip():
        return {"success": False, "message": "Name is required"}
    if len(name.strip()) > 100:
        return {"success": False, "message": "Name is too long"}
    if len(password) < 8 or len(password) > 128:
        return {"success": False, "message": "Password must be between 8 and 128 characters"}

    existing_user = users_collection.find_one({
        "email": normalized_email
    })

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = {
        "name": name.strip(),
        "email": normalized_email,
        "password": hashed_password.decode("utf-8")
    }

    try:
        users_collection.insert_one(user)
    except DuplicateKeyError:
        return {
            "success": False,
            "message": "Email already exists"
        }

    return {
        "success": True,
        "message": "User registered successfully"
    }


def login_user(email, password):

    normalized_email, error = _validate_credentials(email, password)
    if error:
        return {"success": False, "message": error}

    user = users_collection.find_one({
        "email": normalized_email
    })

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )

    if not password_match:
        return {
            "success": False,
            "message": "Invalid password"
        }

    token = generate_token(str(user["_id"]))

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }
2