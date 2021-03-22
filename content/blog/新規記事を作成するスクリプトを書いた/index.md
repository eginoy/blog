---
title: 新規記事を作成するスクリプトを書いた
date: "2021-03-22"
---
## つくったもの
https://github.com/eginoy/gatsby_new_post_script

## インストール
gatsbyで作成したwebsiteディレクトリに移動し、script格納ディレクトリを作成して移動  
`cd ${your_gatsby_website_dir} && mkdir script && cd script`  

リポジトリ全体は必要無いのでsvnコマンドでscriptを落としてくる  
`svn export https://github.com/eginoy/gatsby_new_post_script/trunk/newpost`  
（TODO: せっかくなのでnpmパッケージとして使えるようにする。）  

package.jsonのscriptsにnewpostコマンドを追加する  
`"scripts": { "newpost": "node ./script/newpost/index.js", "build": "gatsby build", ...`

## 使い方
hello_worldというタイトルの記事を作成する。  
（Markdownのメタデータへ指定したタイトル,本日日付をセットした雛形を生成）  

`yarn newpost hello_world`

## なぜつくったか
 - 以前少し触ったGo製の静的サイトジェネレーター(hugo)には新しいページを作成するコマンドがあったがGatsbyにはなかったので。  
 - 毎回手動で記事を作成するのが面倒。  
 - cliツールを作成してみたいと思っていたところに、良い感じの課題が生えてきたので。  

## 所感
cliツールを作るのは初めてだったが、面倒な作業を自動化できて楽しかった。  
（この記事はスクリプトから生成した雛形から作成した。）  
npmにパッケージを公開した経験も無いので、svnコマンドを使用したインストールになっている箇所を、npmでインストールできるようにしたい。
