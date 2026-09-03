# Base image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Stage 1: Build the backend
FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
# Generate Prisma Client
RUN pnpm --filter @ai-restaurant/database generate
# Build Backend
RUN pnpm --filter backend build

# Stage 2: Production Backend
FROM base AS runner
WORKDIR /app

# Only copy necessary files for the backend
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose backend port
EXPOSE 3001

CMD ["node", "apps/backend/dist/main"]
