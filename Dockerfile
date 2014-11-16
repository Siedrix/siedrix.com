FROM cmfatih/nodejs:latest

RUN npm install -g forever 

ADD . /app
WORKDIR /app

RUN npm install

ENV NODE_ENV production

EXPOSE 4000
CMD ["node", "server.js"]