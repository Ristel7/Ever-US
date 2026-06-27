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
