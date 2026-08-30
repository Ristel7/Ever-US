from flask_socketio import SocketIO

# The web client is served by this Flask application. Leaving cross-origin
# origins unset keeps Socket.IO same-origin by default; authorization is also
# enforced per connection and per room in socket_events.py.
socketio = SocketIO()
