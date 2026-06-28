# Stage 1: Build stage (has all dev tools)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# install ONLY production deps
RUN npm ci --omit=dev 
COPY . .

# Stage 2: Production image (lean, only what's needed)
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

# Copy from builder
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .

USER nodeuser
EXPOSE 3000
ENV NODE_ENV=production

# Health check built into the container
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/app.js"]