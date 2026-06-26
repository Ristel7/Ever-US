from flask import jsonify


def success(message, data=None, status_code=200):
#Standard success response.
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status_code



def error(message, status_code=400, errors=None):
#Standard error response.
    response = {
        "success": False,
        "message": message,
        "errors": errors
    }
    return jsonify(response), status_code

