# syntax=docker/dockerfile:1.6
# Production Dockerfile - multi-stage. Builds the Vite app and serves the
# static bundle via NGINX. The local dev workflow uses Dockerfile.dev instead.

# ---------- Stage 1: build ----------
FROM node:26-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

# Vite inlines VITE_* vars at build time. Railway passes this in via build args.
ARG VITE_API_BASE_URL
ARG VITE_BUSINESS_PHONE
ARG VITE_EMERGENCY_PHONE
ARG VITE_WHATSAPP_NUMBER
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_BUSINESS_PHONE=$VITE_BUSINESS_PHONE \
    VITE_EMERGENCY_PHONE=$VITE_EMERGENCY_PHONE \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway injects $PORT; default to 8080 for local runs.
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "envsubst '\\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
