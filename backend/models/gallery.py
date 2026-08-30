from config.database import db


memories_collection = db["memories"]

# Memories are always queried within a space, newest first. The uploader index
# supports ownership-oriented lookups without adding unused indexes.
memories_collection.create_index(
    [("space_id", 1), ("created_at", -1)],
    name="space_memories_by_created_at"
)
memories_collection.create_index(
    "uploader_id",
    name="memories_by_uploader"
)
