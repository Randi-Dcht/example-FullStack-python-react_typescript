import os
from secrets import token_hex
from flask import request
from flask_jwt_extended import (
    get_jwt_identity,
    verify_jwt_in_request, jwt_required)
from flask_restful import Resource
from jwt import ExpiredSignatureError, DecodeError
from werkzeug.utils import secure_filename
from services.productService import get_list_products, create_product, put_product, delete_product, \
    put_image_product, get_all_products
from services.userService import get_user


class ProductController(Resource):
    @jwt_required()
    def get(self):
        """
        Get the list of products
        :return: list of products
        """
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role == "admin":
                return get_all_products(), 200
            return get_list_products(), 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def post(self):
        """
        Create a new product !!(only admin)!!
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
            if user.role != "admin":
                return {"msg": "You are not allowed to do this action"}, 400
            if data.get("name") is None or data.get("name") == "":
                return {"msg": "No name provided"}, 400
            if data.get("price") is None or data.get("price") == "":
                return {"msg": "No price provided"}, 400
            if data.get("tva") is None or data.get("tva") == "":
                return {"msg": "No tva provided"}, 400
            if data.get("description") is None or data.get("description") == "":
                return {"msg": "No description provided"}, 400
            if data.get("stock") is None or data.get("stock") == "":
                return {"msg": "No stock provided"}, 400
            id_product = create_product(data.get("name"), data.get("price"), data.get("tva"), data.get("description"),
                           data.get("stock"))
            return {"msg": "Product created", "id": id_product}, 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def put(self):
        """
        Update a product !!(only admin)!!
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
            if user.role != "admin":
                return {"msg": "You are not allowed to do this action"}, 401
            if data.get("id") is None or data.get("id") == "":
                return {"msg": "No productId provided"}, 400
            put_product(data.get("id"),
                        data.get("name") if data.get("name") is not None else None,
                        data.get("price") if data.get("price") is not None else None,
                        data.get("tva") if data.get("tva") is not None else None,
                        data.get("description") if data.get("description") is not None else None,
                        data.get("stock") if data.get("stock") is not None else None)
        except (DecodeError, ExpiredSignatureError) as e:
            print(e)
            return {"msg": "Authentication required"}, 401

    @jwt_required()
    def delete(self, productId):
        """
        Delete a product !!(only admin)!!
        A product can't be deleted if it is in a command, the stock will be set to 0
        :param productId:
        :return: message
        """
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


class ProductImgController(Resource):
    @jwt_required()
    def post(self, productid):
        """
        Upload an image for a product !!(only admin)!!
        :param productid:
        :return: name of the image
        """
        try:
            verify_jwt_in_request()
            id_user = get_jwt_identity()
            user = get_user(id_user)
            if user is None:
                return {"msg": "No user found"}, 401
            if user.role != "admin":
                return {"msg": "You are not allowed to do this action"}, 400
            print(request.files)
            if 'file' not in request.files:
                return {"error": "No file part"}, 400

            file = request.files['file']
            if file.filename == '':
                return {"error": "No selected file"}, 400

            filename = secure_filename(
                token_hex(7) + '.' + file.filename
            )

            if file:
                file_path = os.path.join('uploads', filename)
                file.save(file_path)
                put_image_product(productid, filename)
                return {"message": "Image processed and saved", "filename": filename}, 200
        except (DecodeError, ExpiredSignatureError):
            return {"msg": "Authentication required"}, 401
