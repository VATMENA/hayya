FROM oven/bun:1.0.26 AS base

WORKDIR /app

## Install dependencies ##
FROM base AS install

COPY package.json bun.lockb ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile
RUN bun prisma generate

## Build bundle ##
FROM install AS prerelease

ARG API_SUPERKEY
ARG DATABASE_URL
ARG JWT_HMAC_KEY
ARG PUBLIC_VATSIM_OAUTH_CLIENT_ID
ARG PUBLIC_VATSIM_OAUTH_ENDPOINT
ARG PUBLIC_VATSIM_OAUTH_REDIRECT_URI
ARG VATSIM_CORE_API_TOKEN
ARG VATSIM_OAUTH_CLIENT_SECRET
ARG SENTRY_AUTH_TOKEN

COPY --from=install /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN bun --bun run vite build
RUN bun prisma migrate deploy

## Production image ##
FROM base AS app

COPY --from=install /app/node_modules ./node_modules
COPY --from=prerelease /app/build ./build
EXPOSE 3000/tcp
CMD bun ./build/index.js

ENTRYPOINT [ "bun", "--bun" , "run", "build/index.js" ]
