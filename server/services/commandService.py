from models.models import db, Command, CommandProduct


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


def start_preparation_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'waiting':
        command.status = 'preparation'
        db.session.commit()
        return True
    return False


def finish_preparation_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    if command.status == 'preparation':
        command.status = 'finish'
        db.session.commit()
        return True
    return False



def get_command(commandId):
    command = Command.query.filter_by(id=commandId).first()
    articles = CommandProduct.query.filter_by(commandId=commandId).all()
    # TODO : calculate the total price
    # TODO : check with database, request to get the product name and price
    return {
        'id': command.id,
        'userId': command.userId,
        'date': command.date.isoformat(),
        'status': command.status,
        'description': command.description,
        'price_total': 0,
        'articles': [
            {
                'id': article.id,
                'productId': article.productId,
                'name': 'product name',
                'quantity': article.quantity,
                'price_unit': 0,
                'price': 0
            } for article in articles
        ]
    }

# TODO : get_list_commands customer
# TODO : get_list_commands worker
# TODO : get_list_commands admin