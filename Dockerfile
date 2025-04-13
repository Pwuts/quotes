# build application
FROM node:20-alpine AS builder

WORKDIR /tmp/build-env

COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile

COPY src ./src/
COPY nuxt.config.ts tsconfig.json ./
RUN yarn build


# build runner image
FROM node:20-alpine AS runner

WORKDIR /usr/local/bin/quotes
EXPOSE 3000
ENV NODE_ENV=production
CMD npx prisma migrate deploy && yarn start

COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY --from=builder /tmp/build-env/.output ./.output
