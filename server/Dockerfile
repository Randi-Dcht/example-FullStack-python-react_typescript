FROM python:3.12

RUN pip install gunicorn
COPY ./requirements /app/
RUN pip install psycopg2-binary
RUN pip install -r /app/requirements
WORKDIR /app/
COPY ./ /app/
COPY .env /app/
ENTRYPOINT ["gunicorn", "--bind", ":8085", "--timeout", "900", "main:get_app()"]