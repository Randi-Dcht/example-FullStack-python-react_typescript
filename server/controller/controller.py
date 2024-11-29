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
from services.commandService import create_command, add_product_to_command, finish_command, get_list_commands_by_user, \
    get_list_commands, get_list_commands_by_status, cancel_command, start_preparation_command, \
    finish_preparation_command
from services.customerService import get_customer, put_customer, delete_customer, create_customer
from services.productService import get_list_products, get_product, create_product, put_product, delete_product
from services.userService import check_user, get_user, put_user, delete_user, disable_user, enable_user, create_user

load_dotenv()


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
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
@app.post("/api/login")
def login():
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
    return {"access_token": access_token,
            "refresh_token": "refresh_token",
            "type": role}, 200

@app.post("/api/signup")
def signup():
    data = request.get_json()
    if data is None:
        return {"msg": "No data provided"}, 400
    if data.get("username") is None or data.get("username") == "":
        return {"msg": "No username provided"}, 401
    if data.get("password") is None or data.get("password") == "":
        return {"msg": "No password provided"}, 401
    if data.get("email") is None or data.get("email") == "" or "@" not in data.get("email"):
        return {"msg": "No email provided"}, 401
    if data.get("postal_code") is None or data.get("postal_code") == "":
        return {"msg": "No postal code provided"}, 401
    if data.get("city") is None or data.get("city") == "":
        return {"msg": "No city provided"}, 401
    if data.get("country") is None or data.get("country") == "":
        return {"msg": "No country provided"}, 401
    if data.get("phone") is None or data.get("phone") == "":
        return {"msg": "No phone provided"}, 401
    if data.get("street") is None or data.get("street") == "":
        return {"msg": "No street provided"}, 401
    create_customer(data.get("username"), data.get("password"), data.get("email"), "customer",
                    data.get("postal_code"), data.get("city"), data.get("country"), data.get("phone"),
                    data.get("street"))
    return {"msg": "User created"}, 200

class AccountController(Resource):
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
                    "created_at": user.created_at.isoformat()
                }, 200
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

    @jwt_required()
    def post(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            data = request.get_json()
            if data is None:
                return {"msg": "No data provided"}, 400
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin":
                if data.get("role") is None or data.get("role") == "":
                    return {"msg": "No role provided"}, 401
                if data.get("username") is None or data.get("username") == "":
                    return {"msg": "No username provided"}, 401
                if data.get("password") is None or data.get("password") == "":
                    return {"msg": "No password provided"}, 401
                if data.get("email") is None or data.get("email") == "" or "@" not in data.get("email"):
                    return {"msg": "No email provided"}, 401
                create_user(data.get("username"), data.get("password"), data.get("email"), data.get("role"))
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

class AccountActionController(Resource):
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


# ----------------- Controller Product -----------------
class ProductController(Resource):
    def get(self):
        return get_list_products(), 200

    def get(self, productId):
        return get_product(productId), 200

    @jwt_required()
    def post(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            data = request.get_json()
            if data is None:
                return {"msg": "No data provided"}, 400
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role != "admin":
                return {"msg": "You are not allowed to do this action"}, 401
            if data.get("name") is None or data.get("name") == "":
                return {"msg": "No name provided"}, 401
            if data.get("price") is None or data.get("price") == "":
                return {"msg": "No price provided"}, 401
            if data.get("tva") is None or data.get("tva") == "":
                return {"msg": "No tva provided"}, 401
            if data.get("description") is None or data.get("description") == "":
                return {"msg": "No description provided"}, 401
            if data.get("stock") is None or data.get("stock") == "":
                return {"msg": "No stock provided"}, 401
            create_product(data.get("name"), data.get("price"), data.get("tva"), data.get("description"),
                           data.get("stock"), data.get("picture") if data.get("picture") is not None else None)
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

        @jwt_required()
        def put(self):
            try:
                verify_jwt_in_request()
                id_user = get_jwt_identity()
                user = get_user(id_user)
                data = request.get_json()
                if data is None:
                    return {"msg": "No data provided"}, 400
                if user is None:
                    return {"msg": "No user found"}, 401
                if user.role != "admin":
                    return {"msg": "You are not allowed to do this action"}, 401
                if data.get("productId") is None or data.get("productId") == "":
                    return {"msg": "No productId provided"}, 401
                put_product(data.get("productId"),
                            data.get("name") if data.get("name") is not None else None,
                            data.get("price") if data.get("price") is not None else None,
                            data.get("tva") if data.get("tva") is not None else None,
                            data.get("description") if data.get("description") is not None else None,
                            data.get("stock") if data.get("stock") is not None else None,
                            data.get("picture") if data.get("picture") is not None else None)
            except (DecodeError, ExpiredSignatureError):
                return {"msg": "Authentication required"}, 401

        @jwt_required()
        def delete(self, productId):
            try:
                verify_jwt_in_request()
                id_user = get_jwt_identity()
                user = get_user(id_user)
                if user is None:
                    return {"msg": "No user found"}, 401
                if user.role != "admin":
                    return {"msg": "You are not allowed to do this action"}, 401
                delete_product(productId)
            except (DecodeError, ExpiredSignatureError):
                return {"msg": "Authentication required"}, 401


# ----------------- Controller Command -----------------
class CommandController(Resource):
    @jwt_required()
    def post(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            data = request.get_json()
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role != "customer":
                return {"msg": "You are not allowed to do this action"}, 401
            if data is None:
                return {"msg": "No data provided"}, 400
            if data.get("description") is None or data.get("description") == "":
                return {"msg": "No description provided"}, 401
            if data.get("products") is None or type(data.get("products")) is not list or len(data.get("products")) == 0:
                return {"msg": "No products provided"}, 401
            cmd = create_command(id_user, data.get("description"))
            for product in data.get("products"):
                if product.get("productId") is not None and product.get("quantity") is not None:
                    add_product_to_command(cmd, product.get("productId"), product.get("quantity"))
            finish_command(cmd)
            return {"msg": "Command created"}, 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def get(self):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "customer":
                return get_list_commands_by_user(id_user), 200
            if user.role == "admin":
                return get_list_commands(), 200
            if user.role == "worker":
                return {
                    "list_waiting": get_list_commands_by_status("waiting"),
                    "list_preparation": get_list_commands_by_status("preparation")
                }, 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def delete(self, commandId):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "customer" or user.role == "admin":
                return cancel_command(commandId), 200
            else:
                return {"msg": "You are not allowed to do this action"}, 401
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def put(self, commandId, action):
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "worker" or user.role == "admin":
                if action == "start_preparation":
                    return start_preparation_command(commandId), 200
                if action == "finish_preparation":
                    return finish_preparation_command(commandId), 200
            else:
                return {"msg": "You are not allowed to do this action"}, 401
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401



# ----------------- Controller resources -----------------
# Account
api.add_resource(AccountController, '/api/account')
api.add_resource(AccountActionController, '/api/account/<string:action>/<int:userId>')
# Product
api.add_resource(ProductController, '/api/product', '/api/product/<int:productId>')
# Command
api.add_resource(CommandController, '/api/command',
                 '/api/command/<int:commandId>',
                 '/api/command/<int:commandId>/<string:action>')


def init_db():
    """
    Initialize the database. And add the admin user if not exist
    """
    with app.app_context():
        db.create_all()
        if get_user(1) is None:
            create_user("admin", "admin", "admin@admin.be", "admin")


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
    app.run(host='0.0.0.0', port=8085, debug=True)
