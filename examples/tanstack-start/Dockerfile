# Keep build and run base images in sync for libc compatibility.
# "bookworm" is Debian 12.
FROM node:24-bookworm AS builder

RUN corepack enable && corepack prepare pnpm@10.34.4 --activate

WORKDIR /workspace

# Copy monorepo root manifests and NX config.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./

# Copy workspace packages needed to build @ory/elements-react and @ory/tanstack-start.
COPY packages/ ./packages/

# Copy the example app.
COPY examples/tanstack-start/ ./examples/tanstack-start/

# Install all workspace dependencies.
RUN pnpm install --frozen-lockfile

# Build the workspace packages the example depends on.
RUN pnpm exec nx run-many -t build -p @ory/elements-react -p @ory/tanstack-start

ENV NODE_ENV=production

WORKDIR /workspace/examples/tanstack-start

# Build the TanStack Start app with Rsbuild. The server bundle is
# self-contained (only Node built-ins), so the runtime needs no node_modules
# beyond the srvx server.
RUN pnpm run build

# ---- Runtime stage ----
# srvx is an npm CLI, so the runtime uses a slim Node image instead of the
# distroless image the Next.js example can use for its standalone server.
FROM node:24-bookworm-slim AS runner

RUN npm install -g srvx@0.12.5

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/examples/tanstack-start/dist ./dist

USER node

EXPOSE 3000/tcp

# srvx resolves --static relative to the server entry file: ../client is
# dist/client, mirroring the example's `pnpm start` script.
CMD ["srvx", "--prod", "-s", "../client", "dist/server/index.js"]
