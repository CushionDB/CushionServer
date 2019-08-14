FROM node:10-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3001
RUN npm run build
RUN apk --no-cache add curl
CMD ["./bin/start-cushion-server"]
