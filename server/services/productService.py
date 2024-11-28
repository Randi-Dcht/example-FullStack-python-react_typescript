from models.models import db, Product

def create_product(name, price, tva, description, stock, picture):
    product = Product(
        name=name,
        price=price,
        tva=tva,
        description=description,
        stock=stock,
        picture=picture)
    db.session.add(product)
    db.session.commit()
    return product.id


def get_product(productId):
    product = Product.query.filter_by(id=productId).first()
    return product


def get_list_products():
    products = Product.query.all()
    return products


def put_product(productId, name, price, tva, description, stock, picture):
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
    if picture is not None:
        product.picture = picture
    db.session.commit()
    return True