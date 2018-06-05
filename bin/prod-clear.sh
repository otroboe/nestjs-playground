#!/bin/bash

docker-compose -f docker-compose.prod.yml down --volumes
docker rmi rams-app
