FROM node:6.11.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app/
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g pm2
RUN npm prune

# App listens to 3000
EXPOSE 3000

CMD [ "npm", "run", "start" ]
