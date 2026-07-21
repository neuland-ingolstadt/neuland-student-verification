FROM node:22-alpine AS base

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_SHARP_PATH=/app/node_modules/sharp \
    PNPM_HOME="/pnpm" 
ENV PATH="${PNPM_HOME}:${PATH}"

RUN apk add --no-cache tini curl && \
    corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    pnpm run build

FROM base AS runner
WORKDIR /app

RUN addgroup -S nextjs && \
    adduser -S nextjs -G nextjs -u 1001 && \
    mkdir -p .next && \
    chown nextjs:nextjs .next

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/sharp ./node_modules/sharp

USER nextjs

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
    CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]