
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentcart?schema=public" npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
