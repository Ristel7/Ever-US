from flask import request
from bson import ObjectId
from flask_socketio import join_room
from socketio_instance import socketio
from models.user import users_collection
from services.membership_service import is_member
from utils.jwt_handler import verify_token

authenticated_sids = {}


@socketio.on("connect")
def handle_connect(auth):
    """Accept only clients that provide a valid JWT in ``auth.token``."""
    token = auth.get("token") if isinstance(auth, dict) else None
    if not isinstance(token, str) or not token:
        return False

    token_result = verify_token(token)
    if not token_result["success"]:
        return False

    user_id = token_result["data"].get("user_id")
    if not ObjectId.is_valid(user_id):
        return False

    if not users_collection.find_one({"_id": ObjectId(user_id)}):
        return False

    authenticated_sids[request.sid] = str(user_id)


@socketio.on("disconnect")
def handle_disconnect():
    authenticated_sids.pop(request.sid, None)


@socketio.on("join_space")
def handle_join(data):
    user_id = authenticated_sids.get(request.sid)
    space_id = data.get("space_id") if isinstance(data, dict) else None

    if not user_id:
        socketio.emit(
            "join_space_error", {"message": "Authentication required"}, to=request.sid
        )
        return {"success": False, "message": "Authentication required"}

    if not isinstance(space_id, str) or not ObjectId.is_valid(space_id):
        socketio.emit(
            "join_space_error", {"message": "Invalid space ID"}, to=request.sid
        )
        return {"success": False, "message": "Invalid space ID"}

    if not is_member(space_id, user_id):
        socketio.emit(
            "join_space_error", {"message": "You are not a member of this space"}, to=request.sid
        )
        return {"success": False, "message": "You are not a member of this space"}

    join_room(space_id)

    return {"success": True, "message": "Joined space"}
