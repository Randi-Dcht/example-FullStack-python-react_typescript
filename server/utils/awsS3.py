from secrets import token_hex
import boto3
from werkzeug.utils import secure_filename


def upload_file_aws(aws_access_key, aws_secret_key, aws_bucket_name, aws_region, file):
    """
    Upload file to AWS S3
    :param aws_access_key:
    :param aws_secret_key:
    :param aws_bucket_name:
    :param aws_region:
    :param file:
    :return:
    """
    s3 = boto3.client(
        's3',
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region
    )
    filename = secure_filename(
        token_hex(7) + '.' + file.filename
    )
    s3.upload_fileobj(
        file,
        aws_bucket_name,
        filename,
        ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
    )
    return  f"https://{aws_bucket_name}.s3.{aws_region}.amazonaws.com/{filename}", filename


def create_url_aws(aws_bucket_name, aws_region):
    """
    Create url to access the file in AWS S3
    :param aws_bucket_name:
    :param aws_region:
    :return:
    """
    return f"https://{aws_bucket_name}.s3.{aws_region}.amazonaws.com/"