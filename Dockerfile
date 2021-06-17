FROM node:14

RUN mkdir /home/workspace
WORKDIR /home/workspace

COPY . .

RUN apt-get update && apt-get upgrade -y && apt-get install git && \
yarn install

CMD yarn clean && yarn develop

EXPOSE 8000