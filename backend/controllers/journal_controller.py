from flask import request, g

from bson import ObjectId

from services.journal_service import (
    create_entry,
    get_space_entries,
    get_entry,
    update_entry,
    delete_entry
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


def validate_entry_id(entry_id):

    try:
        ObjectId(entry_id)
        return True

    except Exception:
        return False


def check_membership(space_id):

    user_id = g.user["_id"]

    return is_member(
        space_id,
        user_id
    )


def list_journal_entries(space_id):

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

    entries = get_space_entries(
        space_id
    )

    return success(
        "Journal entries fetched successfully",
        {
            "entries": entries
        }
    )


def create_journal_entry(space_id):

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

    content = data.get(
        "content",
        ""
    )

    if not isinstance(title, str):

        return error(
            "Title must be a string",
            400
        )

    if not isinstance(content, str):

        return error(
            "Content must be a string",
            400
        )

    title = title.strip()
    content = content.strip()

    if not title:

        return error(
            "Journal title is required",
            400
        )

    if not content:

        return error(
            "Journal content is required",
            400
        )

    if len(title) > 200:

        return error(
            "Journal title must not exceed 200 characters",
            400
        )

    if len(content) > 10000:

        return error(
            "Journal content must not exceed 10000 characters",
            400
        )

    entry = create_entry(
        space_id,
        g.user["_id"],
        title,
        content
    )

    return success(
        "Journal entry created successfully",
        {
            "entry": entry
        },
        201
    )


def get_single_journal_entry(
    space_id,
    entry_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_entry_id(entry_id):

        return error(
            "Invalid journal entry ID",
            400
        )

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    entry = get_entry(
        space_id,
        entry_id
    )

    if not entry:

        return error(
            "Journal entry not found",
            404
        )

    return success(
        "Journal entry fetched successfully",
        {
            "entry": entry
        }
    )


def update_journal_entry(
    space_id,
    entry_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_entry_id(entry_id):

        return error(
            "Invalid journal entry ID",
            400
        )

    user_id = g.user["_id"]

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    entry = get_entry(
        space_id,
        entry_id
    )

    if not entry:

        return error(
            "Journal entry not found",
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
        entry["author_id"] == user_id
    )

    if not is_author and not is_owner:

        return error(
            "You are not authorized to update this journal entry",
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
        "title"
    )

    content = data.get(
        "content"
    )

    if not isinstance(title, str):

        return error(
            "Title must be a string",
            400
        )

    if not isinstance(content, str):

        return error(
            "Content must be a string",
            400
        )

    title = title.strip()
    content = content.strip()

    if not title:

        return error(
            "Journal title is required",
            400
        )

    if not content:

        return error(
            "Journal content is required",
            400
        )

    if len(title) > 200:

        return error(
            "Journal title must not exceed 200 characters",
            400
        )

    if len(content) > 10000:

        return error(
            "Journal content must not exceed 10000 characters",
            400
        )

    updated = update_entry(
        space_id,
        entry_id,
        title,
        content
    )

    if not updated:

        return error(
            "Unable to update journal entry",
            500
        )

    return success(
        "Journal entry updated successfully",
        {
            "entry": updated
        }
    )


def delete_journal_entry(
    space_id,
    entry_id
):

    if not validate_space_id(space_id):

        return error(
            "Invalid space ID",
            400
        )

    if not validate_entry_id(entry_id):

        return error(
            "Invalid journal entry ID",
            400
        )

    user_id = g.user["_id"]

    if not check_membership(space_id):

        return error(
            "You are not a member of this space",
            403
        )

    entry = get_entry(
        space_id,
        entry_id
    )

    if not entry:

        return error(
            "Journal entry not found",
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
        entry["author_id"] == user_id
    )

    if not is_author and not is_owner:

        return error(
            "You are not authorized to delete this journal entry",
            403
        )

    deleted = delete_entry(
        space_id,
        entry_id
    )

    if not deleted:

        return error(
            "Unable to delete journal entry",
            500
        )

    return success(
        "Journal entry deleted successfully"
    )
