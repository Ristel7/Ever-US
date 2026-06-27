from bson import ObjectId
from datetime import datetime


def serialize(document):

    if isinstance(document, list):
        return [serialize(item) for item in document]

    if isinstance(document, dict):

        serialized = {}

        for key, value in document.items():

            if isinstance(value, ObjectId):
                serialized[key] = str(value)

            elif isinstance(value, datetime):
                serialized[key] = value.isoformat()

            else:
                serialized[key] = value

        return serialized

    return document
