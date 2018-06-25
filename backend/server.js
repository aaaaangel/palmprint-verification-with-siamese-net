// var http = require("http");
// var url = require("url");
// var util = require('util');
 
// function start(route) {
//   function onRequest(request, response) {
//     var pathname = url.parse(request.url).pathname;
//     console.log("Request for " + pathname + " received.");
 
//     route(pathname);
 
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write("Hello World");
//     response.end();
//   }
 
//   http.createServer(onRequest).listen(8888);
//   console.log("Server has started.");
// }
 
// exports.start = start;

var http = require('http');  
var url = require('url');  
var createServer = http.createServer(onRequest);
// var palmlist = require("./palmlist");
var fs = require("fs");
var req = require("request");
  
function onRequest(request, response) {  
    response.writeHead(200, {  
        'Content-Type': 'text/plain',  
        'Access-Control-Allow-Origin': '*'  
    });
    // 解析URL参数
    // console.log(request);
    
    var params = url.parse(request.url, true).query;

    // 返回当前拥有的imgs
    if(params.type == 1){
        // console.log(params);
        console.log(params.name);

        var left = getPic(params.name, true);
        var right = getPic(params.name, false);
        var str = {'left':left, 'right':right};
        str = JSON.stringify(str);  
        console.log(str);
        response.write(str);  
        response.end();  
    }
    // 删除对应Img
    if(params.type == 2){
        var path = __dirname + "/pyScripts/data/" + params.name + "/" + params.hand + "/";
        // 删除文件
        fs.unlink(path+params.filename+".jpg", function(err) {
            if (err) {
                return console.error(err);
            }
            console.log(".jpg删除成功！");
        });
        fs.unlink(path+params.filename+".txt", function(err) {
            if (err) {
                return console.error(err);
            }
            console.log(".txt删除成功！");
        });
        fs.unlink(path+params.filename+"sq.jpg", function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("sq.jpg删除成功！");
        });

        response.end();
    }

    // 存储图片并验证
    if(params.type == 5){
        var path = __dirname + "/pyScripts/data/TEMP/temp/00001.jpg";
        console.log(params.url);

        // var blob = dataURItoBlob(params.url);

        var base64Data = params.url.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFile(path,dataBuffer,function(err){  //path为本地路径例如public/logo.png
            if(err){console.log('保存出错！')}else{
                console.log('保存成功!')
            }
        });
        // console.log(path);
        // req(params.url).pipe(fs.createWriteStream(path));
        // test = "http://s0.hao123img.com/res/img/logo/logonew.png";
        // req(url).pipe(fs.createWriteStream(path));

        // http.get("http://"+params.url,function(req,res){  //path为网络图片地址
        //     var imgData = '';
        //     req.setEncoding('binary');
        //     req.on('data',function(chunk){
        //       imgData += chunk
        //     })
        //     req.on('end',function(){
        //       fs.writeFile(path,imgData,'binary',function(err){  //path为本地路径例如public/logo.png
        //         if(err){console.log('保存出错！')}else{
        //           console.log('保存成功!')
        //         }
        //       })
        //     })
        //   })
        response.end();
    }
    
}  

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

createServer.listen(8080,"192.168.43.222"); 
console.log('Server running  at http://192.168.43.222:8080/');

function getPic(name, left){
    if(left){
        var path = __dirname + "/pyScripts/data/" + name + "/left";
    }
    else{
        var path = __dirname + "/pyScripts/data/" + name + "/right";
    }
    var data = [];
    var max = 0;
    let ddir;
    try{
        ddir = fs.readdirSync(path);
    }catch(err){
        fs.mkdirSync(__dirname + "/pyScripts/data/" + name, function(err){
            if (err) {
                return console.error(err);
            }
            console.log("目录创建成功。");
        });
        fs.mkdirSync(__dirname + "/pyScripts/data/" + name + "/left", function(err){
            if (err) {
                return console.error(err);
            }
            console.log("目录创建成功。");
        });
        fs.mkdirSync(__dirname + "/pyScripts/data/" + name + "/right", function(err){
            if (err) {
                return console.error(err);
            }
            console.log("目录创建成功。");
        });
        ddir = [];
    }
    // console.log(ddir);
    if(ddir!=[]){
        ddir.forEach(function(file){
            // console.log(file);
            if(file.split('.')[1]=='txt'){
                // cnt += 1;
                data.push(file.split('.')[0]);
                var temp = parseInt(file.split('.')[0]);

                if(temp>max)
                    max=temp;
            }
        });
    }
    
    return {'data':data, 'max':max};
};