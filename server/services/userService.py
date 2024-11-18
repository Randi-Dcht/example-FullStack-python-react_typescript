from models.models import db, LoginUser


def create_user(username, password, email, role):
    user = LoginUser(
        username=username,
        password=password,
        email=email,
        role=role)
    db.session.add(user)
    db.session.commit()
    return user.id

def get_user(userId):
    user = LoginUser.query.filter_by(id=userId).first()
    return user


def put_user(userId, username, email, role):
    user = LoginUser.query.filter_by(id=userId).first()
    if username is not None:
        user.username = username
    if email is not None:
        user.email = email
    if role is not None:
        user.role = role
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