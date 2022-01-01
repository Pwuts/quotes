FROM node:16

WORKDIR /usr/local/bin/quotes
CMD npx prisma migrate deploy && yarn start
EXPOSE 3000

COPY package.json yarn.lock ./
RUN yarn

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src/
COPY nuxt.config.ts tsconfig.json ./
RUN yarn build

ENV NODE_ENV=production
RUN npm prune
