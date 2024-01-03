# Use the official Node.js 20 image as the base image
FROM node:20 as base

# Install build essentials and Python3
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

# Install global dependencies: npm, Truffle, Ganache
RUN npm install --global --quiet npm truffle ganache

# Create a new stage named "truffle" based on the "base" stage
FROM base as truffle

# Set the working directory for the truffle stage
RUN mkdir -p /home/app
WORKDIR /home/app

# Copy package files and install dependencies
COPY package.json /home/app
COPY package-lock.json /home/app
RUN npm install --quiet

# Copy Truffle configuration, contracts, migrations, and tests
COPY truffle-config.js /home/app
COPY /contracts /home/app/contracts
COPY /migrations /home/app/migrations/
COPY test /home/app/test/

# Specify the default command to display Truffle version
CMD ["truffle", "version"]

# Create a new stage named "ganache" based on the "base" stage
FROM base as ganache

# Set the working directory for the ganache stage
RUN mkdir -p /home
WORKDIR /home
EXPOSE 8545

# Set the default command to run Ganache with host configuration
ENTRYPOINT ["ganache", "--host=0.0.0.0"]

# Create a new stage named "app" based on the "base" stage
FROM base as app

# Set the working directory for the app stage
WORKDIR /app

# Copy the entire application code into the container
COPY . /app

# Set your app-specific configuration and dependencies
RUN npm install

# Specify the default command to run the application in development mode
CMD ["npm", "run", "dev"]
