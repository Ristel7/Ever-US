from flask import Blueprint
from controllers.space_controller import (
    create_new_space,
    get_spaces,
    get_space,
    update_space,
    delete_space,
    upload_cover_image
)
from middleware.jwt_required import jwt_required
from controllers.space_controller import (
    create_new_space,
    get_spaces,
    get_space,
    update_space,
    delete_space,
    upload_cover_image,
    get_members
)

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


@space_bp.route("/<space_id>/cover", methods=["PUT"])
@jwt_required
def update_cover(space_id):
    return upload_cover_image(space_id)


@space_bp.route(
    "/<space_id>/members",
    methods=["GET"]
)
@jwt_required
def get_members_route(space_id):

    return get_members(
        space_id
    )
