# Uses node version 20 as our base image
FROM node:20

LABEL author="Kai"

# Goes to the frontend directory (think of it like a cd terminal command)
WORKDIR /frontend

# Copy package .json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app into 
COPY . .

# Set port environment variable
ENV PORT=5173

# Expose the port so our computer can access it
EXPOSE 5173

# Run the app (CMD is what docker actually uses to start the container (not RUN))
CMD ["npm", "run", "dev"]