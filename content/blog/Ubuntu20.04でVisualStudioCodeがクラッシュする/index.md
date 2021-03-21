---
title: Ubuntu20.04でVisual Studio Codeがクラッシュする
date: "2021-03-21"
---
### 経緯
WSL2上のUbuntu20.04を使用して開発していたが、ローカルで立てた開発サーバー(localhost)にアクセスできないといった現象が定期的に発生していた。  
根本的な解決ができず、ストレスが貯まるのでDualBootでUbuntu20.04をインストールし、開発環境構築のためVisual Studio Code(以下vscode)を公式からインストールしたところ､起動後にクラッシュしてしまう現象に遭遇し､3時間ほど溶かしてしまったのでワークアラウンドをメモ｡  

### 環境
DISTRIB_ID=Ubuntu  
DISTRIB_RELEASE=20.04  
DISTRIB_CODENAME=focal  
DISTRIB_DESCRIPTION="Ubuntu 20.04.2 LTS"  
Visual Studio Code version = 1.54.3

### 解決手順  
`sudo snap remove code `  
`sudo apt purge code`  
`rm ~/.local/share/keyrings -fr`  
#### 再度vscodeをインストールする｡
snapからインストールすると日本語入力ができないので､公式からダウンロードしてきてインストールする｡  
[公式](https://code.visualstudio.com/)から`.deb`ファイルをインストールしてくる｡  
`sudo apt install ./code_1.54.3-1615806378_amd64.deb` //ファイル名は適宜読み替えること  

### 解決方法の補足
参考リンクへ貼ったIssueに再現手順が書かれているが､自身の環境では以下の流れで今回の問題が発生した｡
1. snapでvscodeをインストール  
1. GitHubアカウントでログインし設定を同期  
1. snap経由でインストールしたvscodeでは日本語入力をできないことがわかりアンインストールする  
1. 公式の`.deb`を使用して再度vscodeをインストール 
1. vscodeが起動後にすぐクラッシュしてしまう  

gnome keyringが持っているGitHubの認証情報がおかしなことになる（異なるバージョンのvscodeが読み書きすることで破壊している？）ことでクラッシュしているようなので､以下のコマンドでkeyringsをクリアすることで解決したと思っている｡  
`rm ~/.local/share/keyrings -fr`  

### 参考
- https://github.com/microsoft/vscode/issues/116690#issuecomment-791064392  
- https://askubuntu.com/questions/78344/how-to-completely-reset-erase-the-keyring
