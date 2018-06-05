#!/bin/bash

rm -rf node_modules/
rm -rf coverage/
rm -rf dist/

docker-compose -f docker-compose.dev.yml down --volumes
