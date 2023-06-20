# Use the base Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Install nodemon globally
RUN npm install -g nodemon



# Set the startup command
CMD ["nodemon", "app.js"]
