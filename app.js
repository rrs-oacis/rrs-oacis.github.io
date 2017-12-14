var app = require('connect')();


var workspace = '/static';

var browserSync = require('browser-sync');
var connectBrowserSync = require('connect-browser-sync');

var browserSyncConfigurations = { "files": "static/*" ,"port":3008};
app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));

app.use(require('serve-static')(__dirname + workspace));
app.listen(8040);

console.log("Listen: "+8040);


//ローカライズ
//require
var chokidar = require("chokidar");

var cLocalize = require('./create-localize.js');

//chokidarの初期化
var watcher = chokidar.watch('./static/ja/page/',{
    ignored:/[\/\\]\./,
    persistent:true
});

//イベント定義
watcher.on('ready',function(){

    //準備完了
    console.log("ready watching...");

    //ファイルの編集
    watcher.on('change',function(path){
        console.log(path + " changed.");
        //cLocalize.localizeFile(path);
        browserSync.reload();
    });
});