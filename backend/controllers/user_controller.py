from flask import request, g

from services.upload_service import upload_image
from services.user_service import update_profile_image

from utils.response import success, error


def get_profile():

    return success(
        "Profile fetched successfully",
        {
            "user": {
                "id": g.user["_id"],
                "name": g.user["name"],
                "email": g.user["email"],
                "profile_image": g.user.get("profile_image", "")
            }
        }
    )


def upload_profile_image():

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
