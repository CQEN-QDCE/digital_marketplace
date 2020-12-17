#!/bin/bash

#doc Keycloak: https://www.keycloak.org/getting-started/getting-started-docker

source .env

if [ ! "$(docker ps -q -f name=keycloak)" ]; 
then
    if [ "$(docker ps -aq -f status=exited -f name=keycloak)" ]; 
    then
        docker start keycloak
    else
        docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_USER=$KEYCLOAK_ADMIN_USER -e KEYCLOAK_PASSWORD=$KEYCLOAK_ADMIN_PASS keycloak_dm
    fi
else
    docker stop keycloak
    docker start keycloak
fi