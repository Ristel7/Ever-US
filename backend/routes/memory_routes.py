from flask import Blueprint

from controllers.memory_controller import (
    list_memories,
    remove_memory,
    upload_memory
)
from middleware.jwt_required import jwt_required


memory_bp = Blueprint("memory", __name__)


@memory_bp.route("/<space_id>/memories", methods=["GET"])
@jwt_required
def list_memories_route(space_id):
    return list_memories(space_id)


@memory_bp.route("/<space_id>/memories", methods=["POST"])
@jwt_required
def upload_memory_route(space_id):
    return upload_memory(space_id)


@memory_bp.route("/<space_id>/memories/<memory_id>", methods=["DELETE"])
@jwt_required
def delete_memory_route(space_id, memory_id):
    return remove_memory(space_id, memory_id)
