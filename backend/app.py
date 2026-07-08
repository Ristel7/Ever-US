from flask import Flask
from flask import send_from_directory
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.space_routes import space_bp
from routes.invite_routes import invite_bp
from routes.message_routes import message_bp
from flask import render_template
from socketio_instance import socketio
from web.page_routes import page_bp


app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

socketio.init_app(app)

import socket_events

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(space_bp, url_prefix="/api/spaces")
app.register_blueprint(invite_bp, url_prefix="/api/invite")
app.register_blueprint(message_bp, url_prefix="/api/messages")
app.register_blueprint(page_bp)

@app.route("/")
def home():
    return {
        "app": "everUS",
        "status": "running"
    }


if __name__ == "__main__":
    socketio.run(
        app,
        debug=True
    )
