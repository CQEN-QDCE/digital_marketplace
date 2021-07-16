FROM quay.io/keycloak/keycloak:latest

#Add realm template vars as ARG here:
ARG ROOTURL
ARG GITHUBID
ARG GITHUBSECRET
ARG KEYCLOAKURL

USER root

#Install uuidgen
RUN microdnf update -y && microdnf install -y util-linux

WORKDIR /tmp/realmconfig
COPY realms ./realms
COPY ./realmconfig.sh .

#Pass your template VARS to realmconfig script:
RUN ./realmconfig.sh "${ROOTURL}" "${GITHUBID}" "${GITHUBSECRET}" "${KEYCLOAKURL}"
RUN ls -m -d $PWD/realms/*.json | tr -d '[:space:]' > realmfileslist

USER 1000
ENTRYPOINT /opt/jboss/tools/docker-entrypoint.sh \
  -b 0.0.0.0 \
  -Dkeycloak.import=$(ls -m -d $PWD/realms/*.json | tr -d '[:space:]') \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=dir \
  -Dkeycloak.migration.dir=/tmp
