from werkzeug.security import check_password_hash, generate_password_hash
from models.models import db, LoginUser


def create_user(username, password, email, role):
    """
    Create a user
    :param username:
    :param password:
    :param email:
    :param role:
    :return: id of the user created or -1 if an error occurred
    """
    if role not in get_list_roles():
        return -1
    if LoginUser.query.filter_by(email=email).first() is not None:
        return -1
    user = LoginUser(
        username=username,
        password=generate_password_hash(password),
        email=email,
        role=role)
    db.session.add(user)
    db.session.commit()
    return user.id


def get_list_roles():
    """
    Get the list of roles
    :return: list of roles
    """
    return ['admin', 'customer', 'worker']


def check_user(username, password):
    """
    Check if the user exists and if the password is correct
    :param username:
    :param password:
    :return: id and role of the user if the user exists and the password is correct, -1 otherwise
    """
    user = LoginUser.query.filter_by(email=username).first()
    if user is None:
        return -1, None
    if check_password_hash(user.password, password):
        return -1, None
    if not user.active:
        return -1, None
    return user.id, user.role


def get_user(userId):
    """
    Get the user
    :param userId:
    :return: Object of the user
    """
    user = LoginUser.query.filter_by(id=userId).first()
    return user


def get_list_users():
    """
    Get the list of users
    :return: list of JSON users
    """
    users = LoginUser.query.all()
    return [get_user_info(user.id) for user in users]



def get_user_info(userId):
    """
    Get the user
    :param userId:
    :return: JSON object of the user
    """
    user = LoginUser.query.filter_by(id=userId).first()
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'created_at': user.created_at.isoformat(),
        'first_connect': user.first_connect
    }


def put_user(userId, username, email):
    """
    Update the user
    :param userId:
    :param username:
    :param email:
    """
    user = LoginUser.query.filter_by(id=userId).first()
    if username is not None:
        user.username = username
    if email is not None:
        user.email = email
    db.session.commit()


def delete_user(userId):
    """
    Delete the user
    :param userId:
    """
    user = LoginUser.query.filter_by(id=userId).first()
    db.session.delete(user)
    db.session.commit()


def disable_user(userId):
    """
    Disable the user
    :param userId:
    """
    user = LoginUser.query.filter_by(id=userId).first()
    user.active = False
    db.session.commit()


def enable_user(userId):
    """
    Enable the user
    :param userId:
    """
    user = LoginUser.query.filter_by(id=userId).first()
    user.active = True
    db.session.commit()


def mail_verified(userId):
    """
    Set the mail as verified
    :param userId:
    """
    user = LoginUser.query.filter_by(id=userId).first()
    user.mail_verified = True
    db.session.commit()