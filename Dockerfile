# Stage 1: Build
FROM node:20.17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Production
FROM node:20.17-alpine AS runner

# Set working directory
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/storage ./storage

# Expose application ports
EXPOSE 3000 3030

# Set default command
CMD [ "node", "./dist/index.js" ]
