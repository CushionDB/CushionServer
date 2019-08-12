FROM node:10-alpine 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3001
RUN npm build
CMD ["npm","start"]