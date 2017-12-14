var cheerio = require('cheerio');

var fs = require('fs');
var path = require("path");

var workspace = './static';


var localizeFile_ = function (fileName) {

    //var fileName = 'tutorial/agent.html';

    fs.readFile(fileName, 'utf8', function (err, text) {

        var langText = "";
        //langText += "{";

        //console.log(text);
        var $ = cheerio.load(text,{decodeEntities: false});

        var eFirst = false;

        var jaJson = {};

        $('[data-localize]').each(function(i, elem) {

            //console.log(i + ': ' + $(elem).text());



            if(!eFirst){
                eFirst =true;
                langText += "\n";
            }else{
                langText += ",";
                langText += "\n";
            }


            langText += "  ";

            langText += '"' + $(elem).attr('data-localize') +'"';

            langText += " : ";

            var rtext = $(elem).html();
            rtext = rtext.replace(/\r?\n/g,"").trim();
            //rtext = rtext.replace(new RegExp("\"","g"),"\\\"");

            langText += '"' + rtext +'"';

            var key = $(elem).attr('data-localize');

            jaJson[key] = rtext;



        });

        langText += "\n";

        langText += "}";

        langText =JSON.stringify(jaJson,null,"  ");

        fileName = fileName.replace("/index.html","");
        fileName = fileName.replace("static/page/","");
        fileName = fileName.replace("/","-");
        fileName = fileName.replace(".html","");

        fs.writeFile(workspace+'/resource/lang/'+fileName+'-ja.json', langText);
        //fs.writeFile('./resource/lang/'+fileName+'-en.json', langText);

        var usFile = workspace+'/resource/lang/'+fileName+'-en.json';

        //fs.writeFile(usFile, langText);


        fs.access(usFile, function (err) {

            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(usFile, langText);
                }
                else {
                    console.error(err);
                    process.exit(1);
                }
            }
            else {

                var enJson = JSON.parse(fs.readFileSync(usFile,'utf8')||"{}");

                var jaJson2 = Object.assign({},jaJson);

                Object.keys(enJson).forEach(function(k) {

                    if(jaJson2[k]){
                        jaJson2[k]= enJson[k];
                    }

                });

                var langEnText =JSON.stringify(jaJson2,null,"  ");

                fs.writeFile(usFile, langEnText);


            }
        });

    });

};

exports.localizeFile = localizeFile_;

var walk = function(p, fileCallback, errCallback) {

    fs.readdir(p, function(err, files) {
        if (err) {
            errCallback(err);
            return;
        }

        files.forEach(function(f) {
            var fp = path.join(p, f); // to full-path
            if(fs.statSync(fp).isDirectory()) {
                walk(fp, fileCallback); // ディレクトリなら再帰
            } else {
                fileCallback(fp); // ファイルならコールバックで通知
            }
        });
    });
};


walk(workspace + "/page/", function(path) {
    console.log(path); // ファイル１つ受信
    var er = path.split(".")[1];

    if(er=="html"){
        localizeFile_(path);
    }

}, function(err) {
    console.log("Receive err:" + err); // エラー受信
});