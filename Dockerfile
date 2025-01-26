# base node image
FROM node:22-slim AS base
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl
RUN corepack enable

# Install all node_modules, including dev dependencies
FROM base AS deps
WORKDIR /myapp

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile --prod=false

# Setup production node_modules
FROM base AS production-deps
WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm prune --prod --config.ignore-scripts=true

# Build the app
FROM base AS build
WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY prisma .

RUN pnpm dlx prisma generate

COPY . .
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base
WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma
COPY --from=build /myapp/build /myapp/build
COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "start"]