docker build -t server-build . && docker run -it -d --restart=always -p8085:8085 --link some-postgres:db --name server-app server-build
