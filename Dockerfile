FROM node:lts-bullseye

RUN mkdir /home/workspace
WORKDIR /home/workspace

COPY . .

RUN apt update && apt upgrade -y && apt install git && \
yarn

CMD yarn clean && yarn develop

EXPOSE 8000