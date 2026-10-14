# Production image for Coolify: builds the site, then serves it with the
# Decap sign-in endpoints (server.js). Containerfile is the local dev image.
FROM docker.io/node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
