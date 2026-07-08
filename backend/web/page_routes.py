from flask import (
    Blueprint,
    render_template,
    redirect
)
page_bp = Blueprint("pages", __name__)


@page_bp.route("/")
def home():
    return render_template("auth/login.html")


@page_bp.route("/dashboard")
def dashboard():
    return render_template("dashboard/dashboard.html")


@page_bp.route("/space")
def spaces():
    return render_template("spaces/space.html")


@page_bp.route("/chat")
def chat():
    return render_template("chat/chat.html")


@page_bp.route("/gallery")
def gallery():
    return render_template("gallery/gallery.html")


@page_bp.route("/timeline")
def timeline():
    return render_template("timeline/timeline.html")


@page_bp.route("/journal")
def journal():
    return render_template("journal/journal.html")


@page_bp.route("/settings")
def settings():
    return render_template("settings/settings.html")


@page_bp.route("/socket-test")
def socket_test():
    return render_template("socket_test.html")


@page_bp.route("/login")
def login():
    return render_template(
        "auth/login.html"
    )


@page_bp.route("/spaces/create")
def create_space():
    return render_template("spaces/create_space.html")


@page_bp.route("/spaces/join")
def join_space():
    return render_template("spaces/join_space.html")
