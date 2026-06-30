FROM docker.io/node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npx", "@11ty/eleventy", "--serve", "--port", "8080"]
