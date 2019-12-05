FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 80
EXPOSE 443
EXPOSE 8080

EXPOSE 9000
EXPOSE 8001
EXPOSE 8000
EXPOSE 5000
EXPOSE 4000

CMD [ "npm", "start" ]