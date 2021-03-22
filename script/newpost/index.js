const fs = require('fs');
const path = require('path');

const postsPath = path.join('content',fs.readdirSync('content')[0]);

let title = process.argv[2];
//template読み込み
let templateText = fs.readFileSync('script/newpost/template.md').toString();

//_title,_dateを置換
let replacedText = templateText.replace("_title",title);
let now = new Date();
let parsedDate = `${now.getFullYear()}-${leftZeroPadding((now.getMonth() + 1))}-${leftZeroPadding((now.getDate()))}`;
replacedText = replacedText.replace("_date",parsedDate);

// ../../content/blog/へ_title名のファルダ作成し、index.md作成
//作成したindex.mdに置換した文字列を書き込み
fs.mkdir(path.join(postsPath,title),err => {
    if(err) throw err;
    fs.writeFile(path.join(postsPath,title,'index.md'), replacedText,err => {
        if(err) throw err;
        console.log('new post create!')
    })
})

function leftZeroPadding(inputString){
    return ('0' + inputString).slice(-2);
}
//codeコマンド実行できるか確認して、codeコマンドで作成したindex.mdを開く
