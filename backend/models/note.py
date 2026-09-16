from datetime import datetime

from config.database import db


notes_collection = db["notes"]


# Indexes for faster space-based queries
notes_collection.create_index(
    [("space_id", 1), ("created_at", -1)]
)

notes_collection.create_index(
    [("author_id", 1)]
)
