# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY data/seed.json ./data/seed.json
RUN npm run build

# ---- runtime stage ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled app + seed data
COPY --from=build /app/dist ./dist
COPY --from=build /app/data/seed.json ./data/seed.json

# Mutable data dir (db.json is written here at runtime)
RUN mkdir -p /app/data && chown -R node:node /app
VOLUME ["/app/data"]

USER node
EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+ (process.env.PORT||3000) +'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
