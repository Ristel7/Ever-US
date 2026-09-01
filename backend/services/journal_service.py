from datetime import datetime

from bson import ObjectId

from models.journal import journal_collection


def serialize_entry(entry):

    return {
        "id": str(entry["_id"]),
        "space_id": str(entry["space_id"]),
        "author_id": str(entry["author_id"]),
        "title": entry.get("title", ""),
        "content": entry.get("content", ""),
        "created_at": (
            entry["created_at"].isoformat()
            if entry.get("created_at")
            else None
        ),
        "updated_at": (
            entry["updated_at"].isoformat()
            if entry.get("updated_at")
            else None
        )
    }


def create_entry(
    space_id,
    author_id,
    title,
    content
):

    now = datetime.utcnow()

    entry = {
        "space_id": space_id,
        "author_id": author_id,
        "title": title,
        "content": content,
        "created_at": now,
        "updated_at": now
    }

    result = journal_collection.insert_one(
        entry
    )

    entry["_id"] = result.inserted_id

    return serialize_entry(entry)


def get_space_entries(space_id):

    entries = journal_collection.find(
        {
            "space_id": space_id
        }
    ).sort(
        "created_at",
        -1
    )

    return [
        serialize_entry(entry)
        for entry in entries
    ]


def get_entry(
    space_id,
    entry_id
):

    try:

        entry_object_id = ObjectId(
            entry_id
        )

    except Exception:

        return None

    entry = journal_collection.find_one({
        "_id": entry_object_id,
        "space_id": space_id
    })

    if not entry:
        return None

    return serialize_entry(entry)


def update_entry(
    space_id,
    entry_id,
    title,
    content
):

    try:

        entry_object_id = ObjectId(
            entry_id
        )

    except Exception:

        return None

    result = journal_collection.update_one(
        {
            "_id": entry_object_id,
            "space_id": space_id
        },
        {
            "$set": {
                "title": title,
                "content": content,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        return None

    return get_entry(
        space_id,
        entry_id
    )


def delete_entry(
    space_id,
    entry_id
):

    try:

        entry_object_id = ObjectId(
            entry_id
        )

    except Exception:

        return None

    result = journal_collection.delete_one({
        "_id": entry_object_id,
        "space_id": space_id
    })

    return result.deleted_count > 0
