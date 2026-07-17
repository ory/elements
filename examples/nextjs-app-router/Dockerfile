# Keep build and run base images in sync for libc compatibility.
# "bookworm" is Debian 12.
FROM node:24-bookworm AS builder

RUN corepack enable && corepack prepare pnpm@10.34.4 --activate

WORKDIR /workspace

# Copy monorepo root manifests and NX config.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./

# Copy workspace packages needed to build @ory/elements-react and @ory/nextjs.
COPY packages/ ./packages/

# Copy the example app.
COPY examples/nextjs-app-router/ ./examples/nextjs-app-router/

# Install all workspace dependencies.
RUN pnpm install --frozen-lockfile

# Build the workspace packages the example depends on.
RUN pnpm exec nx run-many -t build -p @ory/elements-react -p @ory/nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /workspace/examples/nextjs-app-router

# Build the Next.js app in standalone mode.
RUN pnpm run build

# ---- Runtime stage ----
FROM gcr.io/distroless/nodejs22-debian12:debug-nonroot AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=builder /workspace/examples/nextjs-app-router/public ./public
COPY --from=builder /workspace/examples/nextjs-app-router/.next/standalone ./
COPY --from=builder /workspace/examples/nextjs-app-router/.next/static ./.next/static

EXPOSE 3000/tcp

CMD ["server.js"]
