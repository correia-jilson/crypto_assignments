# Use Node.js 14 for ARM64
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies (this will install sqlite3 and other packages)
RUN npm install

# Rebuild sqlite3 specifically for ARM64
RUN npm rebuild sqlite3 --build-from-source

# Copy the rest of the application code
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the backend server
CMD ["node", "index.js"]
