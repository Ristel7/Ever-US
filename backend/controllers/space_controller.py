from flask import request, g

from services.space_service import (
    create_space,
    get_user_spaces,
    get_space_by_id,
    update_space_by_id,
    delete_space_by_id
)
from utils.response import success, error
from services.membership_service import add_member


def create_new_space():
    data = request.get_json()

    space_name = data.get("space_name")
    space_type = data.get("space_type")

    owner_id = g.user["_id"]

    result = create_space(
        space_name,
        space_type,
        owner_id
    )


    add_member(
        result["space_id"],
        owner_id,
        "owner"
    )

    return success(
        result["message"],
        {
            "space_id": result["space_id"]
        },
        201
    )


def get_spaces():
    owner_id = g.user["_id"]

    spaces = get_user_spaces(owner_id)

    return success(
        "Spaces fetched successfully",
        {
            "spaces": spaces
        }
    )


def get_space(space_id):

    owner_id = g.user["_id"]

    space = get_space_by_id(space_id, owner_id)

    if not space:
        return error(
            "Space not found",
            404
        )

    return success(
        "Space fetched successfully",
        {
            "space": space
        }
    )


def update_space(space_id):

    owner_id = g.user["_id"]

    data = request.get_json()

    result = update_space_by_id(
        space_id,
        owner_id,
        data
    )

    if not result:
        return error(
            "Space not found",
            404
        )

    return success(
        "Space updated successfully"
    )


def delete_space(space_id):

    owner_id = g.user["_id"]

    result = delete_space_by_id(
        space_id,
        owner_id
    )

    if not result:
        return error(
            "Space not found",
            404
        )

    return success(
        "Space deleted successfully"
    )

