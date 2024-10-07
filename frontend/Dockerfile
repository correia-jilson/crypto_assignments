# Stage 1: Build the React application
FROM node:14 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
