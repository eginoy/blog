---
title: radcastをDockerで動くようにした
date: "2021-05-02"
---
### 作ったもの
https://github.com/eginoy/radcast-docker

### 動機
radikoのタイムフリーは再生開始から24時間という、聴取期限が切られている。  
自分は家事を始めるタイミングでタイムフリーを聴くことが多い。  
聴くものは深夜ラジオがほとんどなので（長さが1、2時間）、ラジオを聴き終える前に家事が先に終了してしまう。  
次に家事を始めるタイミングであらためて続きを聴き始める、といったことをしたいのだが、冒頭に書いた聴取期限があるので日をまたいで聴くことができない。  
そこで、[radcast](https://github.com/omiso46/radcast)というradikoを録音するOSSを見つけたのでこちらを利用することにした。  

#### なぜDockerを利用したか
以前から興味があり、はてブのホッテントリに上がってくるDocker,Docker Composeの入門記事をハンズオン形式で進めていた。  
しかし、業務でDockerを扱う機会がないので、チュートリアルを終えた後にすることがなく困っていた。  
今回の環境構築は良い機会だと考え、Docker上でradcastを動かすことにした。

### Dockerファイルを書いてみて学べた、つまずいた箇所

#### alpineイメージでタイムゾーンがJSTにならない
radcastはcronで録音スケジュール管理をしているので、コンテナ内のタイムゾーンをJSTにしておきたかった。  
Dockerファイル、Docker Composeファイルでタイムゾーン環境変数を指定するだけではJSTにならなかった。（`date`コマンドで確認）  
こちらは既知の問題だったため、すぐに解決できた。※[参考](https://www.collelog.jp/technical-howto/alpine-linux-timezone-setting)  
``` Dockerfile
FROM golang:alpine
RUN mkdir /home/radcast
WORKDIR /home/radcast

RUN apk update  && apk add ffmpeg git tzdata &&\
cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && apk del tzdata && \
go get github.com/omiso46/radcast && \
mkdir recorded  

CMD chmod +x config-create.sh && ./config-create.sh && \
radcast --config ./config.json --host 0.0.0.0 --output ./recorded --port 3355
EXPOSE 3355
```

#### alpineのデフォルトシェルはash
radcastの録音スケジュールファイルが存在しない場合に、設定ファイルを自動生成するシェルスクリプトを書いた。  
このシェルスクリプトの先頭行（shebangと呼ぶらしい）に`#!/bin/bash`と書いてしまった。  
```bash
#!/bin/ash
#↑ここを /bin/bashにしてしまった。
FILE="config.json"
if [ ! -e $FILE ]; then
    radcast --setup > config.json
    chmod 777 config.json
fi
```
処理部分の構文に問題があると勘違いしてしまい、解決に時間がかかった。  
alpineのデフォルトシェルがashだということは知らなかったので、この問題に当たったことで学べたのは良かった。

### Docker Composeファイルを書いてみて学べた箇所
#### コンテナの自動起動はDocker Composeが面倒を見てくれる
radcastの利用目的を考えると、システム起動時に自動起動して欲しい。  
docker-composeファイルに`restart`を指定するとコンテナを自動起動してくれる。
コンテナの停止と起動（再起動）をコマンド一発で行えないかと検索していたら、たまたま見つけることができた。※[参考](https://junchang1031.hatenablog.com/entry/2016/05/18/000605)  
ちなみにコンテナの再起動は`$ docker-compose restart`
```yml
version: "3.2"
services: 
    radcast:
        build: .
        volumes: 
          - ./:/home/radcast
        ports: 
          - "3355:3355"
        tty: true
        restart: unless-stopped
```

### 所感
Docker,Docker Composeはチュートリアルをこなすばかりで、自身の課題を解決するために各設定ファイルを1から書いたのは今回がはじめてだった。  
現在運用しているRaspberryPi4が故障しても、Dockerが利用できる環境へGitHubからリポジトリを落としてくるだけで環境を構築できるのは非常に良いと思った。  
コマンド一発で環境構築できるのは気持ちが良いし、楽しい。