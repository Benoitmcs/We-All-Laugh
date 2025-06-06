# ---------- 1) Build front-end ----------
FROM node:20 AS builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build      # outputs to client/dist or .next

# ---------- 2) Build back-end ----------
FROM node:20-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ ./                      # Express source
COPY --from=builder /app/client/dist ./public   # or .next/static

ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
