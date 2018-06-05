#!/bin/bash

docker-compose -f docker-compose.dev.yml up -d

npm install
npm run fixtures:init
npm run start:watch
