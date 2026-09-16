from config.database import db


time_capsules_collection = db["time_capsules"]


# Space-based queries
time_capsules_collection.create_index(
    [
        ("space_id", 1),
        ("unlock_at", 1)
    ]
)

# Author-based queries
time_capsules_collection.create_index(
    [
        ("author_id", 1),
        ("created_at", -1)
    ]
)
