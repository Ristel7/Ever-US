from flask import request
from flask_socketio import join_room
from socketio_instance import socketio


@socketio.on("join_space")
def handle_join(data):

    space_id = data["space_id"]

    join_room(space_id)

    print(f"{request.sid} joined {space_id}")
