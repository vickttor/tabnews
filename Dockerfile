FROM node:18.2.0-alpine

WORKDIR /app/tabnews

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"] 