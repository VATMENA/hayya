FROM imbios/bun-node AS base
WORKDIR /app

## Install dependencies ##
FROM base AS setup
WORKDIR /app

COPY package.json bun.lockb ./
COPY prisma ./prisma
RUN bun i && bun svelte-kit sync && bun prisma generate

## Build bundle ##
FROM base AS builder

ARG API_SUPERKEY
ARG DATABASE_URL
ARG JWT_HMAC_KEY
ARG PUBLIC_VATSIM_OAUTH_CLIENT_ID
ARG PUBLIC_VATSIM_OAUTH_ENDPOINT
ARG PUBLIC_VATSIM_OAUTH_REDIRECT_URI
ARG VATSIM_CORE_API_TOKEN
ARG VATSIM_OAUTH_CLIENT_SECRET

WORKDIR /app

COPY --from=setup /app/node_modules ./node_modules
COPY . .

RUN bun run build && bun prisma migrate deploy

## Production image ##
FROM oven/bun AS app
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=setup /app/node_modules ./node_modules
EXPOSE 3000
CMD bun ./build/index.js
