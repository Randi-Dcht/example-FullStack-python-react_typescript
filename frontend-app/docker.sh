npm install
npm run build
docker build -t frontend-build .
docker run -it -d --restart=always -p 5173:5173 --name frontend-app frontend-build