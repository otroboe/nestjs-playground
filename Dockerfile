FROM node:carbon

WORKDIR /usr/src/app

# Global Deps
RUN npm install pm2 -g

# App deps
COPY . /usr/src/app
RUN npm install
RUN npm run prestart:prod
RUN npm prune --production

# Create an .env file
COPY ./.env.default /usr/src/app/.env

# Symlink the public repo
RUN ln -s /usr/src/app/src/public /usr/src/app/dist/src/public

# Overwrite env vars
ENV DB_HOST maria

# Expose the default port
EXPOSE 3000
