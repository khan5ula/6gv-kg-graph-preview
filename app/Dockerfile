# Use the official Node runtime as the parent image
FROM node:18

# The working directory in the container
WORKDIR /usr/src/app

# Copy package.json to the working directory
COPY package*.json ./

#Install dependencies
RUN npm ci

# Bundle the code inside the docker image
COPY . .

# Build the Typescript app
RUN npm run build

# Expose port 3000
EXPOSE 3000

## Start the application
CMD [ "node", "build/src/index.js" ]
