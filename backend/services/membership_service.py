from datetime import datetime

from models.membership import memberships_collection


def add_member(space_id, user_id, role="member"):

    member = {
        "space_id": space_id,
        "user_id": user_id,
        "role": role,
        "joined_at": datetime.utcnow()
    }

    result = memberships_collection.insert_one(member)

    return str(result.inserted_id)


def is_member(space_id, user_id):

    member = memberships_collection.find_one({
        "space_id": space_id,
        "user_id": user_id
    })

    return member is not None


def get_space_members(space_id):

    members = list(
        memberships_collection.find({
            "space_id": space_id
        })
    )

    return serialize(members)
