from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class LoginUser(db.Model):
    """
    LoginUser
    Table to store the users of the application (admin, customer, worker)
    """
    __tablename__ = 'login_users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(500), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    role = db.Column(db.String(50), nullable=False) # admin, customer, worker
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    active = db.Column(db.Boolean, nullable=False, default=True)
    first_connect = db.Column(db.Boolean, nullable=True, default=True)


class Customer(db.Model):
    """
    Customer
    Table to store the customers of the application (linked to a user)
    """
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('login_users.id'), nullable=False)
    postal_code = db.Column(db.String(10), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    street = db.Column(db.String(200), nullable=False)


class Product(db.Model):
    """
    Product
    Table to store the products of the application
    """
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    tva = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    picture = db.Column(db.String(200), default='none.png', nullable=False)


class Command(db.Model):
    """
    Command
    Table to store the commands of the application (metadata ; linked to a user)
    """
    __tablename__ = 'commands'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('login_users.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=db.func.now())
    status = db.Column(db.String(50), nullable=False, default='creation')  # creation, waiting, preparation, cancellation, finish
    description = db.Column(db.Text, nullable=True)


class CommandProduct(db.Model):
    """
    Command Product
    Table to store the products of a command (linked to a command and a product)
    """
    __tablename__ = 'command_products'
    id = db.Column(db.Integer, primary_key=True)
    commandId = db.Column(db.Integer, db.ForeignKey('commands.id'), nullable=False)
    productId = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
