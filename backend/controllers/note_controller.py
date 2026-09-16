from flask import request, g
from bson import ObjectId

from services.note_service import (
    create_note,
    get_notes,
    get_note_by_id,
    update_note,
    delete_note
)

from services.membership_service import is_member

from utils.response import success, error


# =========================================================
# VALIDATION HELPERS
# =========================================================

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


def _validate_note_fields(data):
    allowed_fields = {
        "title",
        "content"
    }

    unexpected_fields = (
        set(data.keys()) - allowed_fields
    )

    if unexpected_fields:
        return None, "Unsupported note field"

    title = data.get("title")
    content = data.get("content")

    # -------------------------
    # TITLE
    # -------------------------

    if not isinstance(title, str):
        return None, "Title must be a string"

    title = title.strip()

    if not title:
        return None, "Title is required"

    if len(title) > 200:
        return None, "Title must be at most 200 characters"

    # -------------------------
    # CONTENT
    # -------------------------

    if not isinstance(content, str):
        return None, "Content must be a string"

    content = content.strip()

    if not content:
        return None, "Content is required"

    if len(content) > 10000:
        return None, "Content must be at most 10000 characters"

    return {
        "title": title,
        "content": content
    }, None


# =========================================================
# GET ALL NOTES
# =========================================================

def get_space_notes(space_id):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(
        space_id,
        user_id
    ):
        return error(
            "You are not a member of this space",
            403
        )

    notes = get_notes(space_id)

    return success(
        "Notes fetched successfully",
        {
            "notes": notes
        }
    )


# =========================================================
# GET SINGLE NOTE
# =========================================================

def get_single_note(
    space_id,
    note_id
):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    if not _valid_id(note_id):
        return error(
            "Invalid note ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(
        space_id,
        user_id
    ):
        return error(
            "You are not a member of this space",
            403
        )

    note = get_note_by_id(
        note_id,
        space_id
    )

    if not note:
        return error(
            "Note not found",
            404
        )

    return success(
        "Note fetched successfully",
        {
            "note": note
        }
    )


# =========================================================
# CREATE NOTE
# =========================================================

def create_space_note(space_id):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(
        space_id,
        user_id
    ):
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

    fields, validation_error = (
        _validate_note_fields(data)
    )

    if validation_error:
        return error(
            validation_error,
            400
        )

    note_id = create_note(
        space_id,
        user_id,
        fields["title"],
        fields["content"]
    )

    return success(
        "Note created successfully",
        {
            "note_id": note_id
        },
        201
    )


# =========================================================
# UPDATE NOTE
# =========================================================

def update_space_note(
    space_id,
    note_id
):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    if not _valid_id(note_id):
        return error(
            "Invalid note ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(
        space_id,
        user_id
    ):
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

    fields, validation_error = (
        _validate_note_fields(data)
    )

    if validation_error:
        return error(
            validation_error,
            400
        )

    updated = update_note(
        note_id,
        space_id,
        user_id,
        fields["title"],
        fields["content"]
    )

    if not updated:
        return error(
            "Note not found or unauthorized",
            404
        )

    return success(
        "Note updated successfully"
    )


# =========================================================
# DELETE NOTE
# =========================================================

def delete_space_note(
    space_id,
    note_id
):

    if not _valid_id(space_id):
        return error(
            "Invalid space ID",
            400
        )

    if not _valid_id(note_id):
        return error(
            "Invalid note ID",
            400
        )

    user_id = g.user["_id"]

    if not is_member(
        space_id,
        user_id
    ):
        return error(
            "You are not a member of this space",
            403
        )

    deleted = delete_note(
        note_id,
        space_id,
        user_id
    )

    if not deleted:
        return error(
            "Note not found or unauthorized",
            404
        )

    return success(
        "Note deleted successfully"
    )
