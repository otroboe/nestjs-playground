# NestJS Playground - API Movie Schedule (rams)

## Stack

**NodeJS**: https://nodejs.org/en/

**Nest**: https://nestjs.com/
```
A progressive Node.js framework for building efficient and scalable server-side applications on top of TypeScript & JavaScript (ES6 / ES7 / ES8) heavily inspired by Angular
```

**TypeORM**: http://typeorm.io
```
TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap and Ionic platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7)
```

**MariaDB**: https://mariadb.org/

**Docker**: https://www.docker.com/

## Requirements

### Install NodeJS and npm
- [Download](https://nodejs.org/en/download/)
- [Install via package manager](https://nodejs.org/en/download/package-manager/)

### Install Docker and docker-compose
- https://docs.docker.com/installation
- https://docs.docker.com/compose/install/
- [Manage Docker as a non-root user](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user)

## Configuration files

You have to create your own `.env` file, avoiding sharing password, and customizing depending on your own dev environment.

You can copy the default file, and have to update it. Or create your own.
```
cp .env.default .env
```

Set your `DB_PASSWORD` and `DB_ROOT_PASSWORD` (for *dev* environment).

## Commands

### Dev

#### First time
```
./bin/dev-start.sh
```
It will starts 2 containers:
- MariaDB server for the API data on `3306` port.
- Adminer to manage MariaDB data while programming on http://localhost:8080.

#### Start the app
```
npm run start

# Watch for changes for automatic restart
npm run start:watch
```

The default URL is http://localhost:3000.

#### Clear all dev data and containers:
```
./bin/dev-clear.sh
```

### Prod
```
# Build for production
npm run prestart:prod

# Start the production app version
npm run start:prod
```

```
# Start all stack
DB_PASSWORD={{your_pwd}} DB_ROOT_PASSWORD={{your_pwd}} ./bin/prod-start.sh
```

```
# Inject fixtures
docker exec rams-prod-app node dist/bin/fixtures-init.js
```

```
# Clear all prod data and containers
./bin/prod-clear.sh
```

### Data
```
# Insert fixtures data
npm run fixtures:init

# Remove all fixtures from DB
npm run fixtures:clear
```

### Tests
```
# Run unit tests
npm test

# Run and watch unit tests
npm run test:watch

# Run unit tests coverage
npm run test:coverage

# Opn coverage html report
npm run open:coverage
```

```
# Run end-to-end tests
npm run e2e

# Run and watch end-to-end tests
npm run e2e:watch
```

## URLs

- API: http://localhost:3000
- Swagger definitions: http://localhost:3000/swagger 
- Adminer: http://localhost:8080

## TODO
- Check the compatibility for `enum` in swagger nestjs library ([Github issue](https://github.com/nestjs/swagger/issues/19)).
- Check the tests coverage for `constructor` with injection 
  * [Github issue](https://github.com/istanbuljs/istanbuljs/issues/70)
  * [Angular Issue](https://github.com/angular/angular-cli/issues/5526)
- Find a way to not expose URLs in Swagger (e.g. list of movies)

## Issues
- The logger is logging duplication when a request is called.

## Resources

**NestJS**
- [Documentation](https://docs.nestjs.com/)
- [Typescript starter](https://github.com/nestjs/typescript-starter)
- [Examples](https://github.com/nestjs/nest/tree/master/examples)

**Docker**
- [MySQL container](https://hub.docker.com/_/mysql/)
- [Adminer container](https://hub.docker.com/_/adminer/)
- https://github.com/vishnubob/wait-for-it

**Misc**
- [TypeORM](https://github.com/typeorm/typeorm)
- TypeScript linter: [TSLint](https://palantir.github.io/tslint/)
- Watch and reload while coding: [nodemon](https://nodemon.io/)

**Tips**
- TypeORM repositories for unit testing: [here](https://github.com/nestjs/nest/issues/363#issuecomment-360105413)
