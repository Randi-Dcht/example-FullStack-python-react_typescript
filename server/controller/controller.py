import os
from datetime import timedelta

import requests
from flask import Flask, request, redirect, url_for
from flask.cli import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    get_jwt_identity,
    verify_jwt_in_request, create_access_token, jwt_required,
)
from flask_restful import Api, Resource
from models.models import db

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=2)
app.config["static_folder"] = os.getenv('STATIC_FOLDER')

CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

db.init_app(app)
jwt = JWTManager(app)

def init_db():
    """
    Initialize the database. And add the admin user if not exist
    """
    with app.app_context():
        db.create_all()


def get_app():
    """
    Get the app
    :return: app
    """
    init_db()
    return app


def run_server():
    """
    Main function to run the server
    """
    init_db()
    app.run(host='0.0.0.0', port=8050, debug=True)

