FROM node:14 AS builder

# Either development or production
# Default to production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Default to port 80
ARG PORT=80
ENV PORT $PORT

# Create app directory as root
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Change USER after apt/yum/apk, but before npm install
USER node

# Wildcard to ensure package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

# Stage 2

FROM nginx:1

COPY --from=builder /home/node/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Document published port
EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]