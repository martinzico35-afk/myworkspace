# ---- Build stage: install production deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime stage ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S zeepredict && adduser -S zeepredict -G zeepredict

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY backend ./backend
COPY server.js ./

USER zeepredict
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "backend/server.js"]
