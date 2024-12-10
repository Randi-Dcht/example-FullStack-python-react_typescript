from flask import request
from flask_jwt_extended import (
    get_jwt_identity,
    verify_jwt_in_request, create_access_token, jwt_required,
)
from flask_restful import  Resource
from jwt import ExpiredSignatureError, DecodeError
from services.customerService import get_customer, put_customer, delete_customer, create_customer
from services.userService import check_user, get_user, put_user, delete_user, disable_user, enable_user, create_user, \
    get_user_info, get_list_users


class LoginController(Resource):
    def post(self):
        """
        Login function to get the token
        :return: token
        """
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
                "type": role}, 200


class RegisterController(Resource):
    @jwt_required()
    def get(self):
        """
        Get the user information
        :return: json of the user
        """
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin" or user.role == "worker":
                return get_user_info(id_user), 200
            if user.role == "customer":
                return get_customer(id_user), 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401


    def post(self):
        """
        Register a new customer
        :return:
        """
        data = request.get_json()
        if data is None:
            return {"msg": "No data provided"}, 400
        if data.get("username") is None or data.get("username") == "":
            return {"msg": "No username provided"}, 400
        if data.get("password") is None or data.get("password") == "":
            return {"msg": "No password provided"}, 400
        if data.get("email") is None or data.get("email") == "" or "@" not in data.get("email"):
            return {"msg": "No email provided"}, 400
        if data.get("postal_code") is None or data.get("postal_code") == "":
            return {"msg": "No postal code provided"}, 400
        if data.get("city") is None or data.get("city") == "":
            return {"msg": "No city provided"}, 400
        if data.get("country") is None or data.get("country") == "":
            return {"msg": "No country provided"}, 400
        if data.get("phone") is None or data.get("phone") == "":
            return {"msg": "No phone provided"}, 400
        if data.get("street") is None or data.get("street") == "":
            return {"msg": "No street provided"}, 400
        create_customer(data.get("username"), data.get("password"), data.get("email"), "customer",
                        data.get("postal_code"), data.get("city"), data.get("country"), data.get("phone"),
                        data.get("street"))
        return {"msg": "User created"}, 200


class AccountController(Resource):
    @jwt_required()
    def get(self):
        """
        Get the user information
        :return: json of the user
        """
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin" :
                return get_list_users(), 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def put(self):
        """
        Update the user information
        :return: message
        """
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
        """
        Delete the user
        :return: message
        """
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
        """
        Create a new user (admin or worker) !!(only admin)!!
        :return: message
        """
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
        """
        Enable or disable a user !!(only admin)!!
        :param action:
        :param userId:
        :return: message
        """
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
