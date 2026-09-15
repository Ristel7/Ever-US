from config.database import db

bucket_list_collection = db["bucket_list"]

bucket_list_collection.create_index(
    [("space_id", 1), ("created_at", -1)]
)

bucket_list_collection.create_index(
    [("space_id", 1), ("completed", 1)]
)

bucket_list_collection.create_index(
    [("author_id", 1)]
)
