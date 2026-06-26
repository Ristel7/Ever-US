import bcrypt

from models.user import users_collection
from utils.jwt_handler import generate_token


def register_user(name, email, password):

    existing_user = users_collection.find_one({
        "email": email
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
        "name": name,
        "email": email,
        "password": hashed_password.decode("utf-8")
    }

    users_collection.insert_one(user)

    return {
        "success": True,
        "message": "User registered successfully"
    }


def login_user(email, password):

    user = users_collection.find_one({
        "email": email
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
