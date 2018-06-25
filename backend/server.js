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
  
function onRequest(request, response) {  
    response.writeHead(200, {  
        'Content-Type': 'text/plain',  
        'Access-Control-Allow-Origin': '*'  
    });
    // 解析URL参数
    // console.log(request);
    
    var params = url.parse(request.url, true).query;
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
    
}  

createServer.listen(8080); 
console.log('Server running  at http://127.0.0.1:8080/');

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