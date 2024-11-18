from models.models import db, Customer
from services.userService import get_user, create_user, put_user, delete_user


def create_customer(username, password, email, role, postal_code, city, country, phone, street):
    userId = create_user(username, password, email, role)
    customer = Customer(
        user_id=userId,
        postal_code=postal_code,
        city=city,
        country=country,
        phone=phone,
        street=street)
    db.session.add(customer)
    db.session.commit()
    return userId


def get_customer(userId):
    customer = Customer.query.filter_by(user_id=userId).first()
    logi = get_user(userId)
    return {
        'id': logi.id,
        'username': logi.username,
        'email': logi.email,
        'role': logi.role,
        'postal_code': customer.postal_code,
        'city': customer.city,
        'country': customer.country,
        'phone': customer.phone,
        'street': customer.street
    }


def put_customer(userId, postal_code, city, country, phone, street):
    customer = Customer.query.filter_by(user_id=userId).first()
    if postal_code is not None:
        customer.postal_code = postal_code
    if city is not None:
        customer.city = city
    if country is not None:
        customer.country = country
    if phone is not None:
        customer.phone = phone
    if street is not None:
        customer.street = street
    db.session.commit()


def delete_customer(userId):
    customer = Customer.query.filter_by(user_id=userId).first()
    db.session.delete(customer)
    db.session.commit()
    delete_user(userId)

