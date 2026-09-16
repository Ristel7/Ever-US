from datetime import datetime

from bson import ObjectId

from models.note import notes_collection
from utils.serializer import serialize


def create_note(
    space_id,
    author_id,
    title,
    content
):
    now = datetime.utcnow()

    document = {
        "space_id": space_id,
        "author_id": author_id,
        "title": title,
        "content": content,
        "created_at": now,
        "updated_at": now
    }

    result = notes_collection.insert_one(document)

    return str(result.inserted_id)


def get_notes(space_id):
    notes = list(
        notes_collection.find(
            {
                "space_id": space_id
            }
        ).sort(
            "created_at",
            -1
        )
    )

    return serialize(notes)


def get_note_by_id(
    note_id,
    space_id
):
    if not ObjectId.is_valid(note_id):
        return None

    note = notes_collection.find_one(
        {
            "_id": ObjectId(note_id),
            "space_id": space_id
        }
    )

    if not note:
        return None

    return serialize(note)


def update_note(
    note_id,
    space_id,
    author_id,
    title,
    content
):
    if not ObjectId.is_valid(note_id):
        return False

    result = notes_collection.update_one(
        {
            "_id": ObjectId(note_id),
            "space_id": space_id,
            "author_id": author_id
        },
        {
            "$set": {
                "title": title,
                "content": content,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.matched_count > 0


def delete_note(
    note_id,
    space_id,
    author_id
):
    if not ObjectId.is_valid(note_id):
        return False

    result = notes_collection.delete_one(
        {
            "_id": ObjectId(note_id),
            "space_id": space_id,
            "author_id": author_id
        }
    )

    return result.deleted_count > 0
