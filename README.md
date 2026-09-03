# AI Restaurant Receptionist

A production-grade multi-tenant SaaS platform for restaurant reception management.

## Project Structure

This is a pnpm monorepo containing:

- `apps/frontend`: Next.js 15 application.
- `apps/backend`: NestJS application.
- `packages/config`: Shared configurations.
- `packages/database`: Prisma schema and database tools.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/tsconfig`: Shared TypeScript configurations.
- `packages/types`: Shared TypeScript types.
- `packages/ui`: Shared UI component library.
- `packages/utils`: Shared utilities.

## Prerequisites

- Node.js (v20+)
- pnpm (v9+)
- Docker & Docker Compose (for PostgreSQL and Redis)

## Developer Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` at the root, and configure your variables (e.g., Firebase).

3. **Start Infrastructure:**
   ```bash
   docker-compose up -d
   ```

4. **Initialize Database:**
   ```bash
   pnpm --filter @ai-restaurant/database run db:push
   pnpm --filter @ai-restaurant/database run db:seed
   ```

5. **Start Development Servers:**
   ```bash
   pnpm dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Swagger Docs: http://localhost:3001/api/docs

## Architecture Overview

The system is designed with a strict multi-tenant architecture. Every business table belongs to a `Tenant` (restaurant).
The backend uses NestJS with structured logging, central error handling, and robust tenant extraction middlewares.
The frontend uses Next.js with shadcn/ui and Tailwind CSS.
Both systems utilize Firebase for identity and authentication.

## Sprint 1 Details

Sprint 1 implements the foundational architecture ONLY. Modules like Restaurant Management, Orders, Reservations, and the AI components will be built in subsequent sprints.
