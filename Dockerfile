FROM node:18-alpine AS builder

WORKDIR /app

COPY . . 

RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:18-alpine

WORKDIR /app

COPY --from=builder ./app/node_modules ./node_modules
COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/package.json ./package.json

EXPOSE 5000
CMD ["node", "dist/main"]
