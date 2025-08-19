FROM node:18

WORKDIR /app

COPY package*.json ./
ADD source dest
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
