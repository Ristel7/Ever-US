from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from utils.invite_generator import generate_invite_code
from models.space import spaces_collection
from services.membership_service import is_member
from utils.serializer import serialize

def create_space(space_name, space_type, owner_id, description=""):
    # The unique database index is the final collision guard.  Checking first
    # avoids using an exception for the overwhelmingly common collision case.
    for _ in range(5):
        invite_code = generate_invite_code()
        if spaces_collection.find_one({"invite_code": invite_code}):
            continue

        space = {
            "space_name": space_name,
            "space_type": space_type,
            "owner_id": owner_id,
            "invite_code": invite_code,
            "cover_image": "",
            "description": description,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        try:
            result = spaces_collection.insert_one(space)
            return {
                "success": True,
                "message": "Space created successfully",
                "space_id": str(result.inserted_id)
            }
        except DuplicateKeyError:
            continue

    return {
        "success": False,
        "message": "Unable to generate a unique invite code"
    }


def get_user_spaces(user_id):

    from models.membership import memberships_collection

    memberships = memberships_collection.find(
        {"user_id": user_id}, {"space_id": 1}
    )
    space_ids = [
        ObjectId(member["space_id"])
        for member in memberships
        if ObjectId.is_valid(member.get("space_id"))
    ]

    spaces = list(
        spaces_collection.find(
            {
                "$or": [
                    {"owner_id": user_id},
                    {"_id": {"$in": space_ids}}
                ]
            },
            {
                "_id": 1,
                "space_name": 1,
                "space_type": 1,
                "cover_image": 1,
                "description": 1
            }
        )
    )

    return serialize(spaces) 



def get_space_by_id(space_id, user_id):
    if not ObjectId.is_valid(space_id):
        return None

    space = spaces_collection.find_one({
        "_id": ObjectId(space_id)
    })

    if not space:
        return None

    if space.get("owner_id") != user_id and not is_member(space_id, user_id):
        return None

    space["_id"] = str(space["_id"])

    return space



def update_space_by_id(space_id, owner_id, data):
    if not ObjectId.is_valid(space_id):
        return False

    data["updated_at"] = datetime.utcnow()

    result = spaces_collection.update_one(
        {
            "_id": ObjectId(space_id),
            "owner_id": owner_id
        },
        {
            "$set": data
        }
    )

    return result.matched_count > 0



def delete_space_by_id(space_id, owner_id):
    if not ObjectId.is_valid(space_id):
        return False

    result = spaces_collection.delete_one(
        {
            "_id": ObjectId(space_id),
            "owner_id": owner_id
        }
    )

    return result.deleted_count > 0


def update_space_cover(space_id, owner_id, image_url):
    if not ObjectId.is_valid(space_id):
        return False

    result = spaces_collection.update_one(
        {
            "_id": ObjectId(space_id),
            "owner_id": owner_id
        },
        {
            "$set": {
                "cover_image": image_url,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.matched_count > 0
