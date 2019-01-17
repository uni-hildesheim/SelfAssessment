FROM node:11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Expose port 8000 (what our Express.js server wants)
EXPOSE 8000

# Start server.js
# By default, the backend server will try to connect to localhost to reach the db server.
# That approach cannot work with docker because the backend and the db server are two separate
# container instances, which means they do not run on the same host, so localhost cannot be used.
# Instead, we just override the hostname here and set it to the one specified as link target in
# docker-compose.yml ('mongo').
CMD [ "npm", "start", "--", "--mongouri=mongodb://mongo:27017/selfassessment" ]

# TODO: Don't run as root
#USER node
