from datetime import datetime, timezone

from flask import request, g
from bson import ObjectId

from services.time_capsule_service import (
    create_time_capsule,
    get_time_capsules,
    get_time_capsule_by_id,
    delete_time_capsule
)

from services.membership_service import is_member
from utils.response import success, error


def _valid_id(value):
    return (
        isinstance(value, str)
        and ObjectId.is_valid(value)
    )


def _json_body():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return None

    return data


def _parse_unlock_date(value):

    if not isinstance(value, str):
        return None

    value = value.strip()

    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )

        if parsed.tzinfo is None:
            parsed = parsed.replace(
                tzinfo=timezone.utc
            )

        return parsed.astimezone(
            timezone.utc
        ).replace(tzinfo=None)

    except ValueError:
        return None


def get_space_capsules(space_id):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    capsules = get_time_capsules(space_id)

    return success(
        "Time capsules fetched successfully",
        {
            "capsules": capsules
        }
    )


def get_single_capsule(
    space_id,
    capsule_id
):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    if not _valid_id(capsule_id):
        return error(
            "Invalid capsule ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    capsule = get_time_capsule_by_id(
        capsule_id,
        space_id
    )

    if not capsule:
        return error(
            "Time capsule not found",
            404
        )

    unlock_at = capsule.get("unlock_at")

    if isinstance(unlock_at, str):

        try:
            unlock_at = datetime.fromisoformat(
                unlock_at.replace("Z", "+00:00")
            )
        except ValueError:
            unlock_at = None

    if unlock_at:

        if unlock_at.tzinfo is None:
            unlock_at = unlock_at.replace(
                tzinfo=timezone.utc
            )

        now = datetime.now(timezone.utc)

        if now < unlock_at:

            return success(
                "Time capsule is still locked",
                {
                    "capsule": {
                        "_id": capsule.get("_id"),
                        "title": capsule.get("title"),
                        "unlock_at": capsule.get("unlock_at"),
                        "locked": True
                    }
                }
            )

    return success(
        "Time capsule fetched successfully",
        {
            "capsule": {
                **capsule,
                "locked": False
            }
        }
    )


def create_space_capsule(space_id):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    data = _json_body()

    if data is None:
        return error(
            "A JSON object is required",
            400
        )

    allowed_fields = {
        "title",
        "content",
        "unlock_at"
    }

    unexpected_fields = (
        set(data.keys()) - allowed_fields
    )

    if unexpected_fields:
        return error(
            "Unsupported time capsule field",
            400
        )

    title = data.get("title")
    content = data.get("content")
    unlock_at_value = data.get("unlock_at")

    if not isinstance(title, str):
        return error(
            "Title must be a string",
            400
        )

    title = title.strip()

    if not title:
        return error(
            "Title is required",
            400
        )

    if len(title) > 200:
        return error(
            "Title must be at most 200 characters",
            400
        )

    if not isinstance(content, str):
        return error(
            "Content must be a string",
            400
        )

    content = content.strip()

    if not content:
        return error(
            "Content is required",
            400
        )

    if len(content) > 10000:
        return error(
            "Content must be at most 10000 characters",
            400
        )

    unlock_at = _parse_unlock_date(
        unlock_at_value
    )

    if not unlock_at:
        return error(
            "A valid unlock date is required",
            400
        )

    if unlock_at <= datetime.utcnow():
        return error(
            "Unlock date must be in the future",
            400
        )

    capsule_id = create_time_capsule(
        space_id,
        user_id,
        title,
        content,
        unlock_at
    )

    return success(
        "Time capsule created successfully",
        {
            "capsule_id": capsule_id
        },
        201
    )


def delete_space_capsule(
    space_id,
    capsule_id
):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    if not _valid_id(capsule_id):
        return error(
            "Invalid capsule ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    deleted = delete_time_capsule(
        capsule_id,
        space_id,
        user_id
    )

    if not deleted:
        return error(
            "Time capsule not found or unauthorized",
            404
        )

    return success(
        "Time capsule deleted successfully"
    )
