FROM node:14.19.3-slim

WORKDIR /app

COPY . .

RUN npm ci 

EXPOSE 3000

CMD ["npm", "start"]