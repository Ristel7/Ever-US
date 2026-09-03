from flask import request, g
from bson import ObjectId
from services.timeline_service import (
    create_timeline_event,
    get_space_timeline,
    get_timeline_event,
    update_timeline_event,
    delete_timeline_event
)
from services.membership_service import is_member
from services.space_service import get_space_by_id
from utils.response import success, error


def validate_space_id(space_id):

    try:
        ObjectId(space_id)
        return True

    except Exception:
        return False


def validate_event_id(event_id):

    try:
        ObjectId(event_id)
        return True

    except Exception:
        return False


def check_membership(space_id):

    user_id = g.user["_id"]

    return is_member(
        space_id,
        user_id
    )


def list_timeline_events(space_id):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    events = get_space_timeline(
        space_id
    )

    return success(
        "Timeline events fetched successfully",
        {
            "events": events
        }
    )


def create_timeline_event_controller(space_id):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    data = request.get_json(
        silent=True
    )

    if not isinstance(data, dict):

        return error(
            "Invalid JSON request",
            400
        )

    title = data.get(
        "title",
        ""
    )

    description = data.get(
        "description",
        ""
    )

    event_date = data.get(
        "event_date",
        ""
    )

    if not isinstance(title, str):

        return error(
            "Title must be a string",
            400
        )

    if not isinstance(description, str):

        return error(
            "Description must be a string",
            400
        )

    if not isinstance(event_date, str):

        return error(
            "Event date must be a string",
            400
        )

    title = title.strip()
    description = description.strip()
    event_date = event_date.strip()

    if not title:

        return error(
            "Timeline title is required",
            400
        )

    if not event_date:

        return error(
            "Event date is required",
            400
        )

    if len(title) > 200:

        return error(
            "Timeline title must not exceed 200 characters",
            400
        )

    if len(description) > 5000:

        return error(
            "Timeline description must not exceed 5000 characters",
            400
        )

    if len(event_date) > 50:

        return error(
            "Event date is invalid",
            400
        )

    event = create_timeline_event(
        space_id,
        g.user["_id"],
        title,
        description,
        event_date
    )

    return success(
        "Timeline event created successfully",
        {
            "event": event
        },
        201
    )


def get_single_timeline_event(
    space_id,
    event_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_event_id(event_id):

        return error(
            "Invalid timeline event ID",
            400
        )

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    event = get_timeline_event(
        space_id,
        event_id
    )

    if not event:

        return error(
            "Timeline event not found",
            404
        )

    return success(
        "Timeline event fetched successfully",
        {
            "event": event
        }
    )


def update_timeline_event_controller(
    space_id,
    event_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_event_id(event_id):

        return error(
            "Invalid timeline event ID",
            400
        )

    user_id = g.user["_id"]

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    event = get_timeline_event(
        space_id,
        event_id
    )

    if not event:

        return error(
            "Timeline event not found",
            404
        )

    space = get_space_by_id(
        space_id,
        user_id
    )

    is_owner = (
        space is not None
        and space.get("owner_id") == user_id
    )

    is_author = (
        event["author_id"] == user_id
    )

    if not is_author and not is_owner:

        return error(
            "You are not authorized to update this timeline event",
            403
        )

    data = request.get_json(
        silent=True
    )

    if not isinstance(data, dict):

        return error(
            "Invalid JSON request",
            400
        )

    title = data.get("title")
    description = data.get("description")
    event_date = data.get("event_date")

    if not isinstance(title, str):

        return error(
            "Title must be a string",
            400
        )

    if not isinstance(description, str):

        return error(
            "Description must be a string",
            400
        )

    if not isinstance(event_date, str):

        return error(
            "Event date must be a string",
            400
        )

    title = title.strip()
    description = description.strip()
    event_date = event_date.strip()

    if not title:

        return error(
            "Timeline title is required",
            400
        )

    if not event_date:

        return error(
            "Event date is required",
            400
        )

    if len(title) > 200:

        return error(
            "Timeline title must not exceed 200 characters",
            400
        )

    if len(description) > 5000:

        return error(
            "Timeline description must not exceed 5000 characters",
            400
        )

    if len(event_date) > 50:

        return error(
            "Event date is invalid",
            400
        )

    updated = update_timeline_event(
        space_id,
        event_id,
        title,
        description,
        event_date
    )

    if not updated:

        return error(
            "Unable to update timeline event",
            500
        )

    return success(
        "Timeline event updated successfully",
        {
            "event": updated
        }
    )


def delete_timeline_event_controller(
    space_id,
    event_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_event_id(event_id):

        return error(
            "Invalid timeline event ID",
            400
        )

    user_id = g.user["_id"]

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    event = get_timeline_event(
        space_id,
        event_id
    )

    if not event:

        return error(
            "Timeline event not found",
            404
        )

    space = get_space_by_id(
        space_id,
        user_id
    )

    is_owner = (
        space is not None
        and space.get("owner_id") == user_id
    )

    is_author = (
        event["author_id"] == user_id
    )

    if not is_author and not is_owner:

        return error(
            "You are not authorized to delete this timeline event",
            403
        )

    deleted = delete_timeline_event(
        space_id,
        event_id
    )

    if not deleted:

        return error(
            "Unable to delete timeline event",
            500
        )

    return success(
        "Timeline event deleted successfully"
    )
