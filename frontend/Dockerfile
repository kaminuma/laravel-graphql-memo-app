FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN apk add --no-cache xvfb

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app with host 0.0.0.0 for Docker
CMD ["npm", "start", "--", "--host", "0.0.0.0"] 