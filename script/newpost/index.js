const fs = require('fs');
const path = require('path');

const postsPath = path.join('content',fs.readdirSync('content')[0]);

let title = process.argv[2];

let templateText = fs.readFileSync('script/newpost/template.md').toString();

let replacedText = templateText.replace("_title",title);
let now = new Date();
let parsedDate = `${now.getFullYear()}-${leftZeroPadding((now.getMonth() + 1))}-${leftZeroPadding((now.getDate()))}`;
replacedText = replacedText.replace("_date",parsedDate);

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