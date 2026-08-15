from flask import Blueprint, render_template


page_bp = Blueprint(
    "pages",
    __name__
)


@page_bp.route("/")
def home():

    return render_template(
        "landing/landing.html"
    )


@page_bp.route("/register")
def register():

    return render_template(
        "auth/register.html"
    )


@page_bp.route("/login")
def login():

    return render_template(
        "auth/login.html"
    )


@page_bp.route("/dashboard")
def dashboard():
    return render_template(
        "dashboard/dashboard.html"
    )


@page_bp.route("/create-space")
def create_space_page():
    return render_template(
        "spaces/create_space.html"
    )


@page_bp.route("/spaces/<space_id>")
def space_details(space_id):
    return render_template(
        "spaces/space-details.html"
    )


@page_bp.route("/memories")
def memories():
    return render_template(
        "memories/memories.html"
    )


@page_bp.route("/messages")
def messages():
    return render_template(
        "messages/messages.html"
    )


@page_bp.route("/timeline")
def timeline():
    return render_template(
        "timeline/timeline.html"
    )
