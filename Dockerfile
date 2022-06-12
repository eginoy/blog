FROM node:lts-bullseye

RUN mkdir /home/workspace
WORKDIR /home/workspace

COPY . .

RUN apt-get update && apt-get upgrade -y && apt-get install git && \
yarn

CMD yarn clean && yarn develop

EXPOSE 8000