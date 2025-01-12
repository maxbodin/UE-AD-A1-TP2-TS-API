FROM node:23.1.0

# Set the working directory inside the container.
WORKDIR /app

# Copy only the package.json and package-lock.json to install dependencies.
COPY package.json ./

# Install dependencies.
RUN npm install

# Install TypeScript globally to ensure `tsc` is available.
RUN npm install -g typescript

# Install Yalc globally for handling local dependencies.
RUN npm install -g yalc

# Copy the rest of the application code, excluding node_modules.
COPY . . --chown=node:node/

# Add the linked local package using Yalc.
RUN yalc add max-todo-list-client

# Expose the frontend's port.
EXPOSE 3006

# Serve the React app.
CMD ["npm", "run", "start"]
