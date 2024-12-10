from flask import request
from flask_jwt_extended import (
    get_jwt_identity,
    verify_jwt_in_request, jwt_required)
from flask_restful import Resource
from jwt import ExpiredSignatureError, DecodeError
from services.commandService import create_command, add_product_to_command, finish_command, get_list_commands_by_user, \
    get_list_commands, get_list_commands_by_status, cancel_command, \
    finish_preparation_command
from services.userService import get_user



class CommandController(Resource):
    @jwt_required()
    def post(self):
        """
        Create a new command !!(only customer)!!
        :return: message
        """
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
        """
        Get the list of commands
        :return: JSON object of the commands
        """
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
                return get_list_commands_by_status("waiting"), 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def delete(self, commandId):
        """
        Cancel a command
        :param commandId:
        :return: message
        """
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
        """
        Finish a command (only worker or admin) or finish the preparation of a command (only worker)
        :param commandId:
        :param action:
        :return: message
        """
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "worker" or user.role == "admin":
                if action == "finish":
                    return finish_preparation_command(commandId), 200
            else:
                return {"msg": "You are not allowed to do this action"}, 401
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401