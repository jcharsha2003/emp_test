# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client code
COPY . .

# Build the React app
RUN npm run build

# Expose the production port
EXPOSE 3000

# Start the client
CMD ["npm", "start"]
