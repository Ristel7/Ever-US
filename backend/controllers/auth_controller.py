from flask import request, jsonify
from services.auth_service import login_user, register_user


def _json_body():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return None
    return data


def register():
    data = _json_body()
    if data is None:
        return jsonify({"success": False, "message": "A JSON object is required"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    result = register_user(name, email, password)

    return jsonify(result), (200 if result["success"] else 400)


def login():
    data = _json_body()
    if data is None:
        return jsonify({"success": False, "message": "A JSON object is required"}), 400

    email = data.get("email")
    password = data.get("password")

    result = login_user(email, password)

    return jsonify(result), (200 if result["success"] else 400)
