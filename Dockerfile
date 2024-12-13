FROM node AS base

WORKDIR /app

## Install dependencies ##
FROM base AS install

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN corepack enable pnpm && pnpm install --frozen-lockfile
RUN pnpm prisma generate

## Build bundle ##
FROM install AS builder
COPY --from=install /app/node_modules node_modules
COPY . .

ARG API_SUPERKEY
ARG DATABASE_URL
ARG JWT_HMAC_KEY
ARG PUBLIC_VATSIM_OAUTH_CLIENT_ID
ARG PUBLIC_VATSIM_OAUTH_ENDPOINT
ARG PUBLIC_VATSIM_OAUTH_REDIRECT_URI
ARG VATSIM_CORE_API_TOKEN
ARG VATSIM_OAUTH_CLIENT_SECRET
ARG SENTRY_AUTH_TOKEN

ENV NODE_ENV=production

RUN corepack enable pnpm && pnpm run build
RUN pnpm prisma migrate deploy

## Production image ##
FROM base AS app

COPY --from=install /app/node_modules node_modules
COPY --from=install /app/package.json package.json
COPY --from=builder /app/build ./build
EXPOSE 3000/tcp

ENTRYPOINT [ "node", "build/index.js" ]
