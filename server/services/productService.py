from models.models import db, Product

def create_product(name, price, tva, description, stock):
    product = Product(
        name=name,
        price=price,
        tva=tva,
        description=description,
        stock=stock)
    db.session.add(product)
    db.session.commit()
    return product.id


def get_product(productId):
    product = Product.query.filter_by(id=productId).first()
    return {
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'tva': product.tva,
        'description': product.description,
        'stock': product.stock,
        'picture': product.picture
    }


def get_list_products():
    products = Product.query.where(Product.stock > 0).all()
    return [ get_product(product.id) for product in products]


def get_all_products():
    products = Product.query.all()
    return [ get_product(product.id) for product in products]


def delete_product(productId):
    product = Product.query.filter_by(id=productId).first()
    product.stock = 0
    db.session.commit()
    return True


def put_product(productId, name, price, tva, description, stock):
    product = Product.query.filter_by(id=productId).first()
    if name is not None:
        product.name = name
    if price is not None and price >= 0:
        product.price = price
    if tva is not None and 0 <= tva <= 100:
        product.tva = tva
    if description is not None:
        product.description = description
    if stock is not None and stock >= 0:
        product.stock = stock
    db.session.commit()
    return True


def put_stock_product(productId,quantity):
    product = Product.query.filter_by(id=productId).first()
    stock = product.stock - quantity
    if stock is not None and stock >= 0:
        product.stock = stock
    db.session.commit()
    return True


def put_image_product(productId, picture):
    product = Product.query.filter_by(id=productId).first()
    if picture is None or product is None:
        return False
    product.picture = picture
    db.session.commit()
    return True