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
