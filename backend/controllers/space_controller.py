from flask import request, g
from bson import ObjectId
from services.upload_service import upload_image
from services.space_service import (
    create_space,
    get_user_spaces,
    get_space_by_id,
    update_space_by_id,
    delete_space_by_id
)
from utils.response import success, error
from services.membership_service import (
    add_member,
    get_space_members
)
from services.space_service import update_space_cover
from constants.space_types import SPACE_TYPES


def _json_body():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def _valid_space_id(space_id):
    return isinstance(space_id, str) and ObjectId.is_valid(space_id)


def _validate_space_fields(data, creating=False):
    allowed_fields = {"space_name", "space_type", "description"}
    unexpected_fields = set(data) - allowed_fields
    if unexpected_fields:
        return None, "Unsupported space field"

    if creating and ("space_name" not in data or "space_type" not in data):
        return None, "Space name and space type are required"

    validated = {}
    if "space_name" in data:
        name = data["space_name"]
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 120:
            return None, "Space name must be between 1 and 120 characters"
        validated["space_name"] = name.strip()

    if "space_type" in data:
        space_type = data["space_type"]
        if not isinstance(space_type, str) or space_type not in SPACE_TYPES:
            return None, "Invalid space type"
        validated["space_type"] = space_type

    if "description" in data:
        description = data["description"]
        if not isinstance(description, str) or len(description) > 2000:
            return None, "Description must be a string of at most 2000 characters"
        validated["description"] = description.strip()

    if not creating and not validated:
        return None, "At least one space field is required"

    return validated, None

def create_new_space():
    data = _json_body()
    if data is None:
        return error("A JSON object is required", 400)

    fields, validation_error = _validate_space_fields(data, creating=True)
    if validation_error:
        return error(validation_error, 400)

    owner_id = g.user["_id"]

    result = create_space(
        fields["space_name"],
        fields["space_type"],
        owner_id,
        fields.get("description", "")
    )

    if not result["success"]:
        return error(result["message"], 500)

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
    if not _valid_space_id(space_id):
        return error("Invalid space ID", 400)

    user_id = g.user["_id"]

    space = get_space_by_id(space_id, user_id)

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
    if not _valid_space_id(space_id):
        return error("Invalid space ID", 400)

    owner_id = g.user["_id"]
    data = _json_body()
    if data is None:
        return error("A JSON object is required", 400)

    fields, validation_error = _validate_space_fields(data)
    if validation_error:
        return error(validation_error, 400)

    result = update_space_by_id(
        space_id,
        owner_id,
        fields
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
    if not _valid_space_id(space_id):
        return error("Invalid space ID", 400)

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


def upload_cover_image(space_id):
    if not _valid_space_id(space_id):
        return error("Invalid space ID", 400)

    if "image" not in request.files:
        return error(
            "No image uploaded",
            400
        )

    image = request.files["image"]

    result = upload_image(image)

    success_update = update_space_cover(
        space_id,
        g.user["_id"],
        result["url"]
    )

    if not success_update:
        return error(
            "Space not found or unauthorized",
            404
        )

    return success(
        "Cover image updated successfully",
        {
            "cover_image": result["url"]
        }
    )


def get_members(space_id):
    if not _valid_space_id(space_id):
        return error("Invalid space ID", 400)

    user_id = g.user["_id"]

    # Make sure the logged-in user belongs to this space
    space = get_space_by_id(
        space_id,
        user_id
    )

    if not space:
        return error(
            "Space not found",
            404
        )

    members = get_space_members(
        space_id
    )

    return success(
        "Members fetched successfully",
        {
            "members": members
        }
    )
