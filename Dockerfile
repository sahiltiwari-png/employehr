# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json bun.lockb ./

# Install dependencies
RUN npm install --production || bun install --production

# Copy rest of the app
COPY . .

# Build the app (if using Vite)
RUN npm run build || bun run build

# Expose port (default Vite port)
EXPOSE 5173

# Start the app
CMD ["npm", "run", "preview"]
