from controller.commandController import CommandController
import os
from datetime import timedelta
from flask import Flask, send_file
from flask.cli import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager
)
from flask_restful import Api
from controller.productController import ProductController, ProductImgController
from controller.userController import AccountController, AccountActionController, LoginController, RegisterController
from models.models import db
from services.userService import get_user, create_user


load_dotenv()


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
db.init_app(app)
jwt = JWTManager(app)


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------- Controller API -----------------
@app.route("/api")
def hello():
    """
    Home page of the API to check if the server is running
    :return: string of the home page
    """
    return "Server is running"


@app.route('/api/download/<filename>', methods=['GET'])
def download_image(filename):
    """
    Download an image from the server
    :param filename:
    :return: image
    """
    processed_path = os.path.join("/Users/randidevtech/Projects/private-git/ExampleFullStack/server/uploads/", filename)
    if os.path.exists(processed_path):
        return send_file(processed_path, mimetype='image/png')
    else:
        return {"error": "File not found"}, 404


# ----------------- Controller resources -----------------
# Account
api.add_resource(AccountController, '/api/account')
api.add_resource(AccountActionController, '/api/account/<int:userId>/<string:action>')
api.add_resource(LoginController, '/api/login')
api.add_resource(RegisterController, '/api/signup')
# Product
api.add_resource(ProductController, '/api/product',
                 '/api/product/<int:productId>')
api.add_resource(ProductImgController, '/api/product/image/<int:productid>')
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


if __name__ == "__main__":
    run_server()