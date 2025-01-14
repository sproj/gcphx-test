FROM node:18

WORKDIR /app

RUN git clone https://github.com/johnny-v/my-api.git .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
