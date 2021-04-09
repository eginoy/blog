---
title: 初めてnpmパッケージを作って公開した
date: "2021-03-31"
---
## 作ったもの
gatsbyの新規記事テンプレートを生成する[cliツール](https://github.com/eginoy/gatsby_new_post_script)

## 目標
`$ yarn add --dev gatsby-new-post-generator`でインストールし、  
`$ yarn newpost ${blogTitle}`のように利用できるようにする。  

## インストールするだけでcliから利用可能にしたい
[前回の記事](https://eginoy.github.io/%E6%96%B0%E8%A6%8F%E8%A8%98%E4%BA%8B%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%82%92%E6%9B%B8%E3%81%84%E3%81%9F/)では`package.json`の`script`にコマンド名とスクリプトのパスを設定することでcliから利用することができた。  
今回はnpmパッケージとして扱いたいので、package.jsonを作成する。  
`$ npm init`  
パッケージ名やその他諸々の情報を含んだpackage.jsonが生成される。  

npmリポジトリからインストール後、追加設定(package.jsonのscriptへ追記)を行うことなくcliから利用できるようにしたい。  
そのため、以下のようにpackage.jsonを変更した。
```json
{
  "name": "gatsby-new-post-generator",
  "version": "1.0.0",
  "description": "Generate gatsby new post(.md) cli script",
  "main": "./lib/newpost.js",
  "bin": {
    "newpost": "bin/index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/eginoy/gatsby-new-post-generator.git"
  },
  "author": "eginoy",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/eginoy/gatsby-new-post-generator/issues"
  },
  "homepage": "https://github.com/eginoy/gatsby-new-post-generator",
  "scripts": {
  },
  "keywords": [
    "gatsby-new-post"
  ],
  "directories": {
    "lib": "lib"
  }
}
```
`main`と`bin`の設定がポイントで、`bin`に設定した`newpost`がcliから呼び出す際のスクリプト名称になっている。  
処理は`main`で指定している`./lib/newpost.js`に記述している。  

### ローカルで動作確認
`yarn add`コマンドの引数にファイルパスを渡すと、ローカルのパッケージを追加することが可能。  
そのため、npmjsリポジトリへ公開する前にローカルで動作確認を行うことができる。  
`$ cd ${gatsby_blog_directory}`  
`$ yarn add --dev ../gatsby-new-post-generator`  

### 動作確認
newpostでの記事生成前
```
$ tree content/blog/
content/blog/
├── Gatsbyでブログを作った
│   └── index.md
├── Ubuntu20.04でVisualStudioCodeがクラッシュする
│   └── index.md
├── 初めてnpmパッケージを公開した
│   └── index.md
└── 新規記事を作成するスクリプトを書いた
    └── index.md
```

以下のコマンドで新しい投稿を生成  
`$ yarn newpost HelloWorld!`
```
$ tree content/blog/
content/blog/
├── Gatsbyでブログを作った
│   └── index.md
├── HelloWorld! //newpostコマンドで生成
│   └── index.md
├── Ubuntu20.04でVisualStudioCodeがクラッシュする
│   └── index.md
├── 初めてnpmパッケージを公開した
│   └── index.md
└── 新規記事を作成するスクリプトを書いた
    └── index.md
```

## 公開手順
### npmjsのアカウントを作成する
[ここ](https://www.npmjs.com/signup)からサインアップする  
自分はnpmjs用のメールアドレスを新しく作成した。(スパムメール対策)  

`$ npm login`でログインする

### 公開する
公開したいパッケージのディレクトリへ移動する  
`$ cd ${npm_package_dir}`  
npmリポジトリへ公開  
`$ npm publish`

## 学べたこと
npmとyarnはパッケージをインストールしたときの挙動が微妙に違うことがわかった。  
今回のようにcli-toolとして利用したいとき、  
yarnを利用すると、`--dev`オプションを利用した場合でも`yarn newpost`のように利用できた。(開発関係依存として追加したプロジェクト内でスコープを限定できる)  
しかし、npmの`--save-dev`オプションで開発依存関係としてパッケージをインストールすると`npm run newpost`、`npm newpost`のように利用することができなかった。  
(グローバルインストール(`-g`オプション)すれば、bash aliasのように`newpost`で使用できるが、gatsbyの記事生成で利用するだけなので適当でない)

## 所感
npmパッケージはインストールして利用するだけで、作成するのは今回が初めてだった。  
そもそもこのような形でまとめるのも初めてで、とても大変だった。  
しかし、やってみると今まで曖昧にしてきた部分を調べ直したりしたので、良い学習になった。
また、意外と手軽にnpmパッケージを作ることができることがわかり、良い経験になった。

## 参考
 - https://nodachisoft.com/common/jp/article/jp000110/
 - https://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
 - https://qiita.com/suzuki_sh/items/f3349efbfe1bdfc0c634
 - https://medium.com/jspoint/creating-cli-executable-global-npm-module-5ef734febe32
 - https://note.kiriukun.com/entry/20190417-path-resolve