import socket_events
import os
from flask import Flask
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.space_routes import space_bp
from routes.invite_routes import invite_bp
from routes.message_routes import message_bp
from routes.memory_routes import memory_bp
from socketio_instance import socketio
from web.page_routes import page_bp
from routes.journal_routes import journal_bp
from routes.timeline_routes import timeline_bp


# PATH CONFIGURATION
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_DIR = os.path.dirname(
    BASE_DIR
)

FRONTEND_DIR = os.path.join(
    PROJECT_DIR,
    "frontend"
)

TEMPLATE_DIR = os.path.join(
    FRONTEND_DIR,
    "templates"
)

STATIC_DIR = os.path.join(
    FRONTEND_DIR,
    "static"
)

# FLASK APP
app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)

# SOCKET.IO
socketio.init_app(app)

# API ROUTES
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    user_bp,
    url_prefix="/api/users"
)

app.register_blueprint(
    space_bp,
    url_prefix="/api/spaces"
)

app.register_blueprint(
    journal_bp,
    url_prefix="/api/spaces"
)

app.register_blueprint(
    timeline_bp,
    url_prefix="/api/spaces"
)

app.register_blueprint(
    invite_bp,
    url_prefix="/api/invite"
)

app.register_blueprint(
    message_bp,
    url_prefix="/api/messages"
)

app.register_blueprint(
    memory_bp,
    url_prefix="/api/spaces"
)


# WEB / PAGE ROUTES
app.register_blueprint(
    page_bp
)

# APPLICATION START
if __name__ == "__main__":

    socketio.run(
        app,
        debug=True
    )
