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

def update_message(message_id, sender_id, new_message):

    from bson import ObjectId

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

    return result.modified_count > 0


def delete_message(message_id, sender_id):

    from bson import ObjectId

    result = messages_collection.delete_one(
        {
            "_id": ObjectId(message_id),
            "sender_id": sender_id
        }
    )

    return result.deleted_count > 0


def is_member(space_id, user_id):

    member = memberships_collection.find_one(
        {
            "space_id": space_id,
            "user_id": user_id
        }
    )

    return member is not None


def update_message(message_id, sender_id, new_message):

    print("=" * 50)
    print("Message ID:", message_id)
    print("Sender ID:", sender_id)

    message = messages_collection.find_one({
        "_id": ObjectId(message_id)
    })

    print("Database Message:", message)

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

    print("Matched:", result.matched_count)
    print("Modified:", result.modified_count)
    print("=" * 50)

    return result.modified_count > 0
