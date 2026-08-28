from datetime import datetime
from bson import ObjectId

from models.user import users_collection


def update_profile_image(user_id, image_url):

    result = users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": {
                "profile_image": image_url,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count > 0


def get_user_by_id(user_id):

    try:

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            return None

        return {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "profile_image": user.get(
                "profile_image",
                ""
            )
        }

    except Exception as error:

        print(
            "Error fetching user:",
            error
        )

        return None
