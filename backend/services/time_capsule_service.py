from datetime import datetime
from bson import ObjectId

from models.time_capsule import time_capsules_collection
from utils.serializer import serialize


def create_time_capsule(
    space_id,
    author_id,
    title,
    content,
    unlock_at
):
    now = datetime.utcnow()

    document = {
        "space_id": space_id,
        "author_id": author_id,
        "title": title,
        "content": content,
        "unlock_at": unlock_at,
        "created_at": now
    }

    result = time_capsules_collection.insert_one(document)

    return str(result.inserted_id)


def get_time_capsules(space_id):
    capsules = list(
        time_capsules_collection.find(
            {"space_id": space_id}
        ).sort(
            "unlock_at",
            1
        )
    )

    return serialize(capsules)


def get_time_capsule_by_id(
    capsule_id,
    space_id
):
    if not ObjectId.is_valid(capsule_id):
        return None

    capsule = time_capsules_collection.find_one(
        {
            "_id": ObjectId(capsule_id),
            "space_id": space_id
        }
    )

    if not capsule:
        return None

    return serialize(capsule)


def delete_time_capsule(
    capsule_id,
    space_id,
    author_id
):
    if not ObjectId.is_valid(capsule_id):
        return False

    result = time_capsules_collection.delete_one(
        {
            "_id": ObjectId(capsule_id),
            "space_id": space_id,
            "author_id": author_id
        }
    )

    return result.deleted_count > 0
