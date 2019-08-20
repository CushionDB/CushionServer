FROM node:10-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk --no-cache add curl
RUN npm install
COPY . .
RUN npm run build
RUN npm uninstall -D
EXPOSE 3001
CMD ["npm","start"]
