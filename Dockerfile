# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine AS production

# Copy the build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose NGINX port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
