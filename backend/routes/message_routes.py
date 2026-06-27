from flask import Blueprint

from controllers.message_controller import (
    send_message,
    get_space_messages,
    edit_message,
    remove_message
)

from middleware.jwt_required import jwt_required

message_bp = Blueprint("message", __name__)


@message_bp.route("/", methods=["POST"])
@jwt_required
def send_message_route():
    return send_message()


@message_bp.route("/<space_id>", methods=["GET"])
@jwt_required
def get_messages_route(space_id):
    return get_space_messages(space_id)


@message_bp.route("/<message_id>", methods=["PUT"])
@jwt_required
def edit_message_route(message_id):
    return edit_message(message_id)


@message_bp.route("/<message_id>", methods=["DELETE"])
@jwt_required
def delete_message_route(message_id):
    return remove_message(message_id)
