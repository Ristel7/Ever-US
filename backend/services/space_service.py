from datetime import datetime
from bson import ObjectId
from utils.invite_generator import generate_invite_code
from models.space import spaces_collection
from utils.serializer import serialize

def create_space(space_name, space_type, owner_id):
    space = {
        "space_name": space_name,
        "space_type": space_type,
        "owner_id": owner_id,
        "invite_code": generate_invite_code(),
        "cover_image": "",
        "description": "",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = spaces_collection.insert_one(space)

    return {
        "success": True,
        "message": "Space created successfully",
        "space_id": str(result.inserted_id)
    }



def get_user_spaces(owner_id):
    spaces = list(
        spaces_collection.find(
            {"owner_id": owner_id},
            {
                "_id": 1,
                "space_name": 1,
                "space_type": 1,
                "cover_image": 1,
                "description": 1
            }
        )
    )

    for space in spaces:
        return serialize(space)



def get_space_by_id(space_id, owner_id):
    space = spaces_collection.find_one({
        "_id": ObjectId(space_id),
        "owner_id": owner_id
    })

    if not space:
        return None

    space["_id"] = str(space["_id"])

    return space



def update_space_by_id(space_id, owner_id, data):
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

    return result.modified_count > 0



def delete_space_by_id(space_id, owner_id):
    result = spaces_collection.delete_one(
        {
            "_id": ObjectId(space_id),
            "owner_id": owner_id
        }
    )

    return result.deleted_count > 0

