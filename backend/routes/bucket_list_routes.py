from flask import Blueprint

from middleware.jwt_required import jwt_required

from controllers.bucket_list_controller import (
    list_bucket_items,
    create_bucket_list_item,
    get_single_bucket_item,
    update_bucket_list_item,
    toggle_bucket_list_item,
    delete_bucket_list_item
)


bucket_list_bp = Blueprint(
    "bucket_list",
    __name__
)


@bucket_list_bp.route(
    "/<space_id>/bucket-list",
    methods=["GET"]
)
@jwt_required
def get_bucket_list_route(space_id):
    return list_bucket_items(space_id)


@bucket_list_bp.route(
    "/<space_id>/bucket-list",
    methods=["POST"]
)
@jwt_required
def create_bucket_list_route(space_id):
    return create_bucket_list_item(space_id)


@bucket_list_bp.route(
    "/<space_id>/bucket-list/<item_id>",
    methods=["GET"]
)
@jwt_required
def get_single_bucket_list_route(space_id, item_id):
    return get_single_bucket_item(
        space_id,
        item_id
    )


@bucket_list_bp.route(
    "/<space_id>/bucket-list/<item_id>",
    methods=["PUT"]
)
@jwt_required
def update_bucket_list_route(space_id, item_id):
    return update_bucket_list_item(
        space_id,
        item_id
    )


@bucket_list_bp.route(
    "/<space_id>/bucket-list/<item_id>/toggle",
    methods=["PUT"]
)
@jwt_required
def toggle_bucket_list_route(space_id, item_id):
    return toggle_bucket_list_item(
        space_id,
        item_id
    )


@bucket_list_bp.route(
    "/<space_id>/bucket-list/<item_id>",
    methods=["DELETE"]
)
@jwt_required
def delete_bucket_list_route(space_id, item_id):
    return delete_bucket_list_item(
        space_id,
        item_id
    )
