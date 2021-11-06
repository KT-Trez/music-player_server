# download node
FROM node:16

# create app dir
WORKDIR /usr/src/musicplayer

# install node_modules
COPY package*.json ./
RUN npm install --only=prod

# bundle app's code
COPY . .

# start app
EXPOSE 3000
CMD ['npm', 'run', 'build']
CMD [ 'npm', 'run', 'deamon' ]