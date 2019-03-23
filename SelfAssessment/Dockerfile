# Build Angular app using node image
FROM node:11-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm install --only=production

# Bundle app source
COPY angular.json ./angular.json
COPY tsconfig.json ./tsconfig.json
COPY tslint.json ./tslint.json
COPY src ./src

# Install angular CLI tools
RUN npm install @angular/cli -g
RUN npm install @angular-devkit/build-angular

# Build in production mode
RUN ng build --prod

# Build a small nginx image with static website
FROM nginx:alpine

# Deploy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular app bundle to nginx image
COPY --from=builder /usr/src/app/dist/SelfAssessment /usr/share/nginx/html

# Run nginx and expose HTTP port
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
