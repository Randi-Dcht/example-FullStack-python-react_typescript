from models.models import db, Command, CommandProduct
from services.productService import get_product, put_stock_product


def create_command(userId, description):
    """
    Create a command
    :param userId:
    :param description:
    :return: id of the command created
    """
    command = Command(
        userId=userId,
        description=description)
    db.session.add(command)
    db.session.commit()
    return command.id


def add_product_to_command(commandId, productId, quantity):
    """
    Add a product to a command
    :param commandId:
    :param productId:
    :param quantity:
    :return: id of the command product created or -1 if an error occurred
    """
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'creation' and quantity > 0:
        commandProduct = CommandProduct(
            commandId=commandId,
            productId=productId,
            quantity=quantity)
        db.session.add(commandProduct)
        db.session.commit()
        put_stock_product(productId, quantity)
        return commandProduct.id
    return -1


def remove_product_from_command(commandId, productId):
    """
    Remove a product from a command
    :param commandId:
    :param productId:
    :return: True if the product has been removed, False otherwise
    """
    cmd = Command.query.filter_by(id=commandId).first()
    if cmd.status == 'creation' or cmd.status == 'waiting':
        commandProduct = CommandProduct.query.filter_by(commandId=commandId, productId=productId).first()
        db.session.delete(commandProduct)
        db.session.commit()
        return True
    return False


def cancel_command(commandId):
    """
    Cancel a command
    :param commandId:
    :return: True if the command has been canceled, False otherwise
    """
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'creation' or command.status == 'waiting':
        command.status = 'cancellation'
        db.session.commit()
        return True
    return False


def finish_command(commandId):
    """
    Finish a command
    :param commandId:
    :return: True if the command has been finished, False otherwise
    """
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'creation':
        command.status = 'waiting'
        db.session.commit()
        return True
    return False



def finish_preparation_command(commandId):
    """
    Finish the preparation of a command
    :param commandId:
    :return: True if the command has been finished, False otherwise
    """
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'waiting':
        command.status = 'finish'
        db.session.commit()
        return True
    return False



def get_command(commandId):
    """
    Get the command
    :param commandId:
    :return: JSON object of the command with the articles (list) JSON object
    """
    command = Command.query.filter_by(id=commandId).first()
    articles = CommandProduct.query.filter_by(commandId=commandId).all()
    return {
        'id': command.id,
        'userId': command.userId,
        'date': command.date.isoformat(),
        'status': command.status,
        'description': command.description,
        'articles': [{
            'quantity': article.quantity,
            'product': get_product(article.productId)
        } for article in articles]
    }


def get_list_status():
    """
    Get the list of status
    :return: list of status
    """
    return ['creation', 'waiting', 'cancellation', 'finish']


def get_list_commands_by_user(userId):
    """
    Get the list of commands by user
    :param userId:
    :return: list of JSON commands
    """
    commands = Command.query.filter_by(userId=userId).all()
    return [get_command(command.id) for command in commands]


def get_list_commands_by_status(status):
    """
    Get the list of commands by status
    :param status:
    :return: list of JSON commands
    """
    commands = Command.query.filter_by(status=status).all()
    return [get_command(command.id) for command in commands]


def get_list_commands():
    """
    Get the list of commands
    :return: list of JSON commands
    """
    commands = Command.query.order_by(Command.date).all()
    return [get_command(command.id) for command in commands]