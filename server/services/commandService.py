from models.models import db, Command, CommandProduct
from services.productService import get_product, put_stock_product


def create_command(userId, description):
    command = Command(
        userId=userId,
        description=description)
    db.session.add(command)
    db.session.commit()
    return command.id


def add_product_to_command(commandId, productId, quantity):
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
    return False


def remove_product_from_command(commandId, productId):
    cmd = Command.query.filter_by(id=commandId).first()
    if cmd.status == 'creation' or cmd.status == 'waiting':
        commandProduct = CommandProduct.query.filter_by(commandId=commandId, productId=productId).first()
        db.session.delete(commandProduct)
        db.session.commit()
        return True
    return False


def cancel_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'creation' or command.status == 'waiting':
        command.status = 'cancellation'
        db.session.commit()
        return True
    return False


def finish_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'creation':
        command.status = 'waiting'
        db.session.commit()
        return True
    return False



def finish_preparation_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'waiting':
        command.status = 'finish'
        db.session.commit()
        return True
    return False



def get_command(commandId):
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
    return ['creation', 'waiting', 'cancellation', 'finish']


def get_list_commands_by_user(userId):
    commands = Command.query.filter_by(userId=userId).all()
    return [get_command(command.id) for command in commands]


def get_list_commands_by_status(status):
    commands = Command.query.filter_by(status=status).all()
    return [get_command(command.id) for command in commands]


def get_list_commands():
    commands = Command.query.order_by(Command.date).all()
    return [get_command(command.id) for command in commands]