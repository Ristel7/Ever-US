from flask import request, g
from bson import ObjectId

from services.bucket_list_service import (
    create_bucket_item,
    get_bucket_items,
    get_bucket_item,
    update_bucket_item,
    toggle_bucket_item,
    delete_bucket_item
)

from services.membership_service import is_member
from utils.response import success, error


def validate_space_id(space_id):
    return (
        isinstance(space_id, str)
        and ObjectId.is_valid(space_id)
    )


def validate_item_id(item_id):
    return (
        isinstance(item_id, str)
        and ObjectId.is_valid(item_id)
    )


def check_membership(space_id):
    user_id = g.user["_id"]

    return is_member(
        space_id,
        user_id
    )


def list_bucket_items(space_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    items = get_bucket_items(space_id)

    return success(
        "Bucket list fetched successfully",
        {
            "items": items
        }
    )


def create_bucket_list_item(space_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error(
            "A JSON object is required",
            400
        )

    title = data.get("title")
    description = data.get("description", "")

    if not isinstance(title, str) or not title.strip():
        return error(
            "Title is required",
            400
        )

    title = title.strip()

    if len(title) > 200:
        return error(
            "Title must be at most 200 characters",
            400
        )

    if not isinstance(description, str):
        return error(
            "Description must be a string",
            400
        )

    description = description.strip()

    if len(description) > 2000:
        return error(
            "Description must be at most 2000 characters",
            400
        )

    item_id = create_bucket_item(
        space_id,
        g.user["_id"],
        title,
        description
    )

    return success(
        "Bucket list item created successfully",
        {
            "item_id": item_id
        },
        201
    )


def get_single_bucket_item(space_id, item_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not validate_item_id(item_id):
        return error("Invalid bucket item ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    item = get_bucket_item(item_id)

    if not item or item.get("space_id") != space_id:
        return error(
            "Bucket list item not found",
            404
        )

    return success(
        "Bucket list item fetched successfully",
        {
            "item": item
        }
    )


def update_bucket_list_item(space_id, item_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not validate_item_id(item_id):
        return error("Invalid bucket item ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error(
            "A JSON object is required",
            400
        )

    allowed_fields = {
        "title",
        "description"
    }

    unexpected = set(data) - allowed_fields

    if unexpected:
        return error(
            "Unsupported bucket list field",
            400
        )

    updates = {}

    if "title" in data:

        title = data["title"]

        if not isinstance(title, str) or not title.strip():
            return error(
                "Title is required",
                400
            )

        if len(title.strip()) > 200:
            return error(
                "Title must be at most 200 characters",
                400
            )

        updates["title"] = title.strip()

    if "description" in data:

        description = data["description"]

        if not isinstance(description, str):
            return error(
                "Description must be a string",
                400
            )

        if len(description) > 2000:
            return error(
                "Description must be at most 2000 characters",
                400
            )

        updates["description"] = description.strip()

    if not updates:
        return error(
            "At least one field is required",
            400
        )

    item = get_bucket_item(item_id)

    if not item or item.get("space_id") != space_id:
        return error(
            "Bucket list item not found",
            404
        )

    success_update = update_bucket_item(
        item_id,
        g.user["_id"],
        updates
    )

    if not success_update:
        return error(
            "You can only edit your own bucket list items",
            403
        )

    return success(
        "Bucket list item updated successfully"
    )


def toggle_bucket_list_item(space_id, item_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not validate_item_id(item_id):
        return error("Invalid bucket item ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    item = get_bucket_item(item_id)

    if not item or item.get("space_id") != space_id:
        return error(
            "Bucket list item not found",
            404
        )

    result = toggle_bucket_item(
        item_id,
        g.user["_id"]
    )

    if not result:
        return error(
            "Unable to update bucket list item",
            404
        )

    return success(
        "Bucket list item updated successfully"
    )


def delete_bucket_list_item(space_id, item_id):

    if not validate_space_id(space_id):
        return error("Invalid space ID", 400)

    if not validate_item_id(item_id):
        return error("Invalid bucket item ID", 400)

    if not check_membership(space_id):
        return error(
            "You are not a member of this space",
            403
        )

    item = get_bucket_item(item_id)

    if not item or item.get("space_id") != space_id:
        return error(
            "Bucket list item not found",
            404
        )

    result = delete_bucket_item(
        item_id,
        g.user["_id"]
    )

    if not result:
        return error(
            "You can only delete your own bucket list items",
            403
        )

    return success(
        "Bucket list item deleted successfully"
    )
