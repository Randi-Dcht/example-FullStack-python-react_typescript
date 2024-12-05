from models.models import db, LoginUser


def create_user(username, password, email, role):
    if role not in get_list_roles():
        return -1
    if LoginUser.query.filter_by(email=email).first() is not None:
        return -1
    user = LoginUser(
        username=username,
        password=password,
        email=email,
        role=role)
    db.session.add(user)
    db.session.commit()
    return user.id


def get_list_roles():
    return ['admin', 'customer', 'worker']


def check_user(username, password):
    user = LoginUser.query.filter_by(email=username).first()
    if user is None:
        return -1, None
    if user.password != password: # TODO check_password_hash(user.password, password):
        return -1, None
    if not user.active:
        return -1, None
    return user.id, user.role


def get_user(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    return user


def put_user(userId, username, email):
    user = LoginUser.query.filter_by(id=userId).first()
    if username is not None:
        user.username = username
    if email is not None:
        user.email = email
    db.session.commit()


def delete_user(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    db.session.delete(user)
    db.session.commit()


def disable_user(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    user.active = False
    db.session.commit()


def enable_user(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    user.active = True
    db.session.commit()


def mail_verified(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    user.mail_verified = True
    db.session.commit()