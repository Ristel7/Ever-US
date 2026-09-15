from datetime import datetime
from bson import ObjectId

from models.bucket_list import bucket_list_collection
from utils.serializer import serialize


def create_bucket_item(space_id, author_id, title, description=""):
    now = datetime.utcnow()

    document = {
        "space_id": space_id,
        "author_id": author_id,
        "title": title,
        "description": description,
        "completed": False,
        "completed_at": None,
        "created_at": now,
        "updated_at": now
    }

    result = bucket_list_collection.insert_one(document)

    return str(result.inserted_id)


def get_bucket_items(space_id):
    items = list(
        bucket_list_collection
        .find({"space_id": space_id})
        .sort("created_at", -1)
    )

    return serialize(items)


def get_bucket_item(item_id):
    if not ObjectId.is_valid(item_id):
        return None

    item = bucket_list_collection.find_one(
        {"_id": ObjectId(item_id)}
    )

    if not item:
        return None

    return serialize(item)


def update_bucket_item(item_id, author_id, updates):
    if not ObjectId.is_valid(item_id):
        return False

    result = bucket_list_collection.update_one(
        {
            "_id": ObjectId(item_id),
            "author_id": author_id
        },
        {
            "$set": {
                **updates,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.matched_count > 0


def toggle_bucket_item(item_id, user_id):
    if not ObjectId.is_valid(item_id):
        return False

    item = bucket_list_collection.find_one(
        {
            "_id": ObjectId(item_id)
        }
    )

    if not item:
        return False

    new_status = not item.get("completed", False)

    bucket_list_collection.update_one(
        {
            "_id": ObjectId(item_id)
        },
        {
            "$set": {
                "completed": new_status,
                "completed_at": (
                    datetime.utcnow() if new_status else None
                ),
                "updated_at": datetime.utcnow()
            }
        }
    )

    return True


def delete_bucket_item(item_id, user_id):
    if not ObjectId.is_valid(item_id):
        return False

    result = bucket_list_collection.delete_one(
        {
            "_id": ObjectId(item_id),
            "author_id": user_id
        }
    )

    return result.deleted_count > 0
