from flask import Blueprint

from controllers.space_controller import (
    create_new_space,
    get_spaces,
    get_space,
    update_space,
    delete_space
)

from middleware.jwt_required import jwt_required

space_bp = Blueprint("space", __name__)

# Create Space


@space_bp.route("/", methods=["POST"])
@jwt_required
def create_space_route():
    return create_new_space()

# Get All Spaces


@space_bp.route("/", methods=["GET"])
@jwt_required
def get_all_spaces_route():
    return get_spaces()

# Get Single Space


@space_bp.route("/<space_id>", methods=["GET"])
@jwt_required
def get_single_space_route(space_id):
    return get_space(space_id)

# Update Space


@space_bp.route("/<space_id>", methods=["PUT"])
@jwt_required
def update_space_route(space_id):
    return update_space(space_id)

# Delete Space


@space_bp.route("/<space_id>", methods=["DELETE"])
@jwt_required
def delete_space_route(space_id):
    return delete_space(space_id)
