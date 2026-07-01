# --- Stage 1: Build Angular App ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# --- Stage 2: Serve Nginx ---
FROM nginx:alpine

# Copy built browser assets to default nginx folder
COPY --from=build /app/dist/creditrack-web-application/browser /usr/share/nginx/html

# Overwrite default nginx virtual host configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
