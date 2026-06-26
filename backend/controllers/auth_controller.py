from flask import request, jsonify
from services.auth_service import login_user, register_user


def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    result = register_user(name, email, password)

    return jsonify(result)


def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    result = login_user(email, password)

    return jsonify(result)
