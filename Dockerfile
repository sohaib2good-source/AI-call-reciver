# Base Node 20 image with modern pnpm and Prisma OpenSSL runtime support
FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm@latest
WORKDIR /app

# Stage 1: Build backend
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @ai-restaurant/database run db:generate
RUN pnpm --filter backend build

# Stage 2: Production Runner
FROM base AS runner
WORKDIR /app

# Copy all built workspace artifacts and dependencies
COPY --from=builder /app ./

# Default backend port
EXPOSE 3001
ENV PORT=3001

CMD ["node", "apps/backend/dist/main"]
