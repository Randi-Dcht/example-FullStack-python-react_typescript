import os
from datetime import timedelta
from flask import Flask, request
from flask.cli import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    get_jwt_identity,
    verify_jwt_in_request, create_access_token, jwt_required,
)
from flask_restful import Api, Resource
from jwt import ExpiredSignatureError, DecodeError
from models.models import db
from services.customerService import get_customer, put_customer, delete_customer
from services.userService import check_user, get_user, put_user, delete_user, disable_user, enable_user


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



# ----------------- Controller API -----------------
@app.route("/api")
def hello():
    """
    Home page of the API to check if the server is running
    :return: string of the home page
    """
    return "Server is running"




# ----------------- Controller Account -----------------
@app.route("/api/login")
def post(self):
    data = request.get_json()
    if data is None:
        return {"msg": "No data provided"}, 400
    if data.get("name") is None or data.get("name") == "":
        return {"msg": "No username provided"}, 401
    if data.get("password") is None or data.get("password") == "":
        return {"msg": "No password provided"}, 401
    user, role = check_user(data.get("name"), data.get("password"))
    if user == -1 or role is None:
        return {"msg": "error connexion"}, 401
    access_token = create_access_token(identity=user)
    return {"access_token": access_token, "type": role}, 200


@app.route("/api/account")
class Account(Resource):
    @jwt_required()
    def get(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin" or user.role == "worker":
                return {
                    "email": user.email,
                    "username": user.username,
                    "created_at": user.created_at
                }
            if user.role == "customer":
                return get_customer(id_user), 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def put(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            data = request.get_json()
            if user is None:
                return {"msg": "No user found"}, 401
            if data is None:
                return {"msg": "No data provided"}, 400
            if user.role == "admin" or user.role == "worker":
                put_user(id_user, data.get("username") if data.get("username") is not None else None,
                         data.get("email") if data.get("email") is not None else None)
                return {"msg": "User updated"}, 200
            if user.role == "customer":
                put_customer(id_user,
                             data.get("postal_code") if data.get("postal_code") is not None else None,
                             data.get("city") if data.get("city") is not None else None,
                             data.get("country") if data.get("country") is not None else None,
                             data.get("phone") if data.get("phone") is not None else None,
                             data.get("street") if data.get("street") is not None else None,
                             data.get("username") if data.get("username") is not None else None,
                             data.get("email") if data.get("email") is not None else None)
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def delete(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin" or user.role == "worker":
                delete_user(id_user)
                return {"msg": "User deleted"}, 200
            if user.role == "customer":
                delete_customer(id_user)
                return {"msg": "User deleted"}, 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401


@app.route("/api/account/<string:action>/<int:userId>")
class AccountAction(Resource):
    @jwt_required()
    def put(self, action, userId):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin":
                if action == "disable":
                    disable_user(userId)
                if action == "enable":
                    enable_user(userId)
                return {"msg": "Action done"}, 200
            else:
                return {"msg": "You are not allowed to do this action"}, 401
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401


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
    app.run(host='0.0.0.0', port=8080, debug=True)
