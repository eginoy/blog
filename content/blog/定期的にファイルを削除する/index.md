---
title: 自動で定期的にファイルを削除する
date: "2021-06-13"
---
radcastで録音したファイルが溜まってきたので、cronを利用して一定期間経過したファイルを自動削除する。  
ファイルの最終更新日が3週間（21日）より前のファイルを対象とする。  

### 最終更新日が3週間より前のファイルを検索する  
今回は対象を削除するので先に検索だけを行い、結果が想定したものになっているか確認しておく。  
`$ find /home/ubuntu/radcast-docker/recorded -mtime 21`

### リストアップされた対象のファイルを削除する  
`$ find /home/ubuntu/radcast-docker/recorded -mtime 21 | xargs rm -rf`

### cronに登録して定期実行
`crontab -e`を利用してジョブを登録する方法もあるが、`crontab -r`とのタイプミスが怖いので、
`/etc/cron.d`配下に直接ファイルを配置してcronジョブを登録する。  
`/etc/crontab`がテンプレートファイル？なのでこちらをコピーして利用する。  
`$ sudo cp /etc/crontab /etc/cron.d/radcast-recorded-clean`  
以下を作成したファイルに書き込んで保存する。  
`* 5 * * sun root find /home/ubuntu/radcast-docker/recorded -mtime +21 | xargs rm -rf`  
毎週日曜日の朝5時に最終更新日が3週間より前のファイルを削除している。  

### cronログの有効化
`$ sudo nano /etc/rsyslog.d/50-default.conf`  
コメントアウト解除（行頭の#を削除）  
`#cron.* /var/log/cron.log`

### 参考
- [findコマンド](https://academy.gmocloud.com/lesson/20191213/8268)
- [cron](https://qiita.com/UNILORN/items/a1a3f62409cdb4256219#3-source%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E9%9A%9Bbash%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84)
- [cronコマンド生成ツール](http://cronbuilder.otchy.net/)