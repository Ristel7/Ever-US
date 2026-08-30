import os

from bson import ObjectId
from flask import g, request

from services.membership_service import is_member
from services.memory_service import (
    create_memory,
    delete_memory,
    get_space_memories
)
from services.upload_service import (
    delete_memory_media,
    upload_memory_media,
    validate_memory_file
)
from utils.response import error, success

MAX_CAPTION_LENGTH = 1000


def _valid_object_id(value):
    return isinstance(value, str) and ObjectId.is_valid(value)


def _member_or_error(space_id):
    if not _valid_object_id(space_id):
        return None, error("Invalid space ID", 400)

    user_id = g.user["_id"]
    if not is_member(space_id, user_id):
        return None, error("You are not a member of this space", 403)

    return user_id, None


def list_memories(space_id):
    _, response = _member_or_error(space_id)
    if response:
        return response

    return success(
        "Memories fetched successfully",
        {"memories": get_space_memories(space_id)}
    )


def upload_memory(space_id):
    user_id, response = _member_or_error(space_id)
    if response:
        return response

    if "file" not in request.files:
        return error("Memory file is required", 400)

    file = request.files["file"]
    media_type, validation_error = validate_memory_file(file)
    if validation_error:
        return error(validation_error, 400)

    caption = request.form.get("caption", "")
    if not isinstance(caption, str):
        return error("Caption must be text", 400)
    caption = caption.strip()
    if len(caption) > MAX_CAPTION_LENGTH:
        return error("Caption is too long", 400)

    try:
        upload_result = upload_memory_media(file, media_type)
        memory = create_memory(
            space_id=space_id,
            uploader_id=user_id,
            media_type=media_type,
            url=upload_result["url"],
            public_id=upload_result["public_id"],
            original_filename=os.path.basename(file.filename),
            caption=caption
        )
    except Exception:
        # If database persistence failed after the upload, do not leave an
        # orphaned Cloudinary asset behind. The client receives no internals.
        if "upload_result" in locals():
            delete_memory_media(upload_result["public_id"], media_type)
        return error("Unable to upload memory", 502)

    return success(
        "Memory uploaded successfully",
        {"memory": memory},
        201
    )


def remove_memory(space_id, memory_id):
    user_id, response = _member_or_error(space_id)
    if response:
        return response

    if not _valid_object_id(memory_id):
        return error("Invalid memory ID", 400)

    result = delete_memory(space_id, memory_id, user_id)
    if not result["success"]:
        if result["reason"] == "not_found":
            return error("Memory not found", 404)
        if result["reason"] == "forbidden":
            return error("You are not allowed to delete this memory", 403)
        return error("Unable to delete memory", 502)

    return success("Memory deleted successfully")
