from flask import Blueprint

from middleware.jwt_required import jwt_required

from controllers.time_capsule_controller import (
    get_space_capsules,
    get_single_capsule,
    create_space_capsule,
    delete_space_capsule
)


time_capsule_bp = Blueprint(
    "time_capsule",
    __name__
)


@time_capsule_bp.route(
    "/<space_id>/time-capsules",
    methods=["GET"]
)
@jwt_required
def get_capsules_route(space_id):
    return get_space_capsules(space_id)


@time_capsule_bp.route(
    "/<space_id>/time-capsules",
    methods=["POST"]
)
@jwt_required
def create_capsule_route(space_id):
    return create_space_capsule(space_id)


@time_capsule_bp.route(
    "/<space_id>/time-capsules/<capsule_id>",
    methods=["GET"]
)
@jwt_required
def get_single_capsule_route(
    space_id,
    capsule_id
):
    return get_single_capsule(
        space_id,
        capsule_id
    )


@time_capsule_bp.route(
    "/<space_id>/time-capsules/<capsule_id>",
    methods=["DELETE"]
)
@jwt_required
def delete_capsule_route(
    space_id,
    capsule_id
):
    return delete_space_capsule(
        space_id,
        capsule_id
    )
