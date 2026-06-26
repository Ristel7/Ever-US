from functools import wraps
from flask import request, jsonify, g
from bson import ObjectId

from utils.jwt_handler import verify_token
from models.user import users_collection


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Authorization header missing"
            }), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Invalid token format"
            }), 401

        token = auth_header.split(" ")[1]

        result = verify_token(token)

        if not result["success"]:
            return jsonify(result), 401

        payload = result["data"]

        try:
            user = users_collection.find_one({
                "_id": ObjectId(payload["user_id"])
            })
        except Exception:
            return jsonify({
                "success": False,
                "message": "Invalid user ID"
            }), 401

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        user["_id"] = str(user["_id"])

        g.user = user

        return f(*args, **kwargs)

    return decorated
