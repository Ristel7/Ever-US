from flask import Flask
from routes.space_routes import space_bp
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.invite_routes import invite_bp

app = Flask(__name__)

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(invite_bp, url_prefix="/api/invite")

app.register_blueprint(
    user_bp,
    url_prefix="/api/users"
)

app.register_blueprint(
    space_bp,
    url_prefix="/api/spaces"
)

@app.route("/")
def home():
    return {
        "app": "everUS",
        "status": "running"
    }


if __name__ == "__main__":
    app.run(debug=True)



