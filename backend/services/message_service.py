from bson import ObjectId
from datetime import datetime

from models.message import messages_collection
from utils.serializer import serialize

def create_message(space_id, sender_id, message):

    document = {
        "space_id": space_id,
        "sender_id": sender_id,
        "message": message,
        "message_type": "text",
        "reply_to": None,
        "is_edited": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = messages_collection.insert_one(document)

    return str(result.inserted_id)


def get_messages(space_id):

    messages = list(
        messages_collection.find(
            {
                "space_id": space_id
            }
        ).sort("created_at", 1)
    )

    return serialize(messages)

def delete_message(message_id, sender_id):
    if not ObjectId.is_valid(message_id):
        return False

    result = messages_collection.delete_one(
        {
            "_id": ObjectId(message_id),
            "sender_id": sender_id
        }
    )

    return result.deleted_count > 0


def update_message(message_id, sender_id, new_message):
    if not ObjectId.is_valid(message_id):
        return False

    result = messages_collection.update_one(
        {
            "_id": ObjectId(message_id),
            "sender_id": sender_id
        },
        {
            "$set": {
                "message": new_message,
                "is_edited": True,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.matched_count > 0


def create_image_message(space_id, sender_id, image_url):

    document = {
        "space_id": space_id,
        "sender_id": sender_id,
        "message": image_url,
        "message_type": "image",
        "reply_to": None,
        "is_edited": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = messages_collection.insert_one(document)

    return str(result.inserted_id)
