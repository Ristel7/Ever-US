from flask import request, g

from services.message_service import (
    create_message,
    get_messages,
    update_message,
    delete_message
)

from services.membership_service import is_member

from utils.response import success, error

from utils.validator import (
    validate_required,
    validate_length
)


def send_message():

    data = request.get_json()

    space_id = data.get("space_id")
    message = data.get("message")

    # Validation
    if not validate_required(space_id):
        return error(
            "Space ID is required",
            400
        )

    if not validate_required(message):
        return error(
            "Message cannot be empty",
            400
        )

    if not validate_length(message, 5000):
        return error(
            "Message is too long",
            400
        )

    user_id = g.user["_id"]

    # Membership Check
    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    message_id = create_message(
        space_id,
        user_id,
        message
    )

    return success(
        "Message sent successfully",
        {
            "message_id": message_id
        },
        201
    )


def get_space_messages(space_id):

    user_id = g.user["_id"]

    if not is_member(space_id, user_id):
        return error(
            "You are not a member of this space",
            403
        )

    messages = get_messages(space_id)

    return success(
        "Messages fetched successfully",
        {
            "messages": messages
        }
    )


def edit_message(message_id):

    data = request.get_json()

    new_message = data.get("message")

    # Validation
    if not validate_required(new_message):
        return error(
            "Message cannot be empty",
            400
        )

    if not validate_length(new_message, 5000):
        return error(
            "Message is too long",
            400
        )

    success_update = update_message(
        message_id,
        g.user["_id"],
        new_message
    )

    if not success_update:
        return error(
            "Message not found or unauthorized",
            404
        )

    return success(
        "Message updated successfully"
    )


def remove_message(message_id):

    success_delete = delete_message(
        message_id,
        g.user["_id"]
    )

    if not success_delete:
        return error(
            "Message not found or unauthorized",
            404
        )

    return success(
        "Message deleted successfully"
    )


def upload_profile_image():

    print("Files:", request.files)

    if "image" not in request.files:
        return error(
            "No image uploaded",
            400
        )

    image = request.files["image"]

    print("Filename:", image.filename)

    result = upload_image(image)

    success_update = update_profile_image(
        g.user["_id"],
        result["url"]
    )

    if not success_update:
        return error(
            "Unable to update profile image",
            500
        )

    return success(
        "Profile image updated successfully",
        {
            "profile_image": result["url"]
        }
    )
