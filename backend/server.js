var apis = require('./functions');
var express = require('express');
var app = express();

var https = require('https');
var http = require('http');

var url = require('url');
var querystring = require('querystring');
var fs = require("fs");
var req = require("request");

let privateKey = fs.readFileSync('private.pem', 'utf8');
let certificate = fs.readFileSync('csr.crt', 'utf8');
let cert = {key: privateKey, cert: certificate};

// var createServer = https.createServer(cert, onRequest);
var createServer = https.createServer(cert, onPostRequest);
let httpsServer = https.createServer(cert, app);

app.use(express.static('/Users/angel/Desktop/computer_vision/finalproject/palmprint-verification-with-siamese-net/frontend'), function (req, res) {
    if(req.protocol === 'https') {
        res.send('https require');
    } else {
        res.send('http require');
    }
});

httpsServer.listen(5000, function() {
    console.log('HTTPS Server is running');
});

// console.log(createServer);

function onPostRequest(request, response) {
    var post = '';
    request.on('data', function (chunk) {
        post += chunk;
    });

    request.on('end', function () {
        post = querystring.parse(post);
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });
        // console.log(post);

        var params = post;

        // 返回当前拥有的imgs
        if(params.type == 1){
            // console.log(params);
            // console.log(params.name);

            var left = getPic(params.name, true);
            var right = getPic(params.name, false);
            var str = {'left':left, 'right':right};
            str = JSON.stringify(str);
            // console.log(str);
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

        // ADD图片
        if(params.type == 4){
            var imgId = parseInt(params.max)+1;
            var imgName = apis.dataLeftCompleting(5, '0', imgId);
            console.log(imgName);
            var path = __dirname + "/pyScripts/data/" + params.name + '/' + params.hand + '/' + imgName +'.jpg';
            var txtPath = __dirname + "/pyScripts/data/" + params.name + '/' + params.hand + '/' + imgName +'.txt';

            var base64Data = params.url.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFileSync(path,dataBuffer,function(err){  //path为本地路径例如public/logo.png
                if(err){console.log('保存出错！')}else{
                    console.log('保存成功!')
                }
            });

            apis.darknet(params.name,params.hand, imgId,function(){
                apis.tailor(params.name,params.hand, imgId,function(tailor){
                    console.log(tailor + "----------------------------------------------------------");
                    if(tailor==1){
                        str = 'Please take photo again';
                        fs.unlink(txtPath, function(err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log(".txt删除成功！");
                        });
                        response.write(str);
                        response.end();
                    }
                    else{
                        response.write("success");
                        response.end();
                    }
                });
            });

        }

        // 存储TEMP图片并验证
        if(params.type == 5){
            var path = __dirname + "/pyScripts/data/TEMP/temp/00001.jpg";
            // console.log(params.url);

            var base64Data = params.url.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFileSync(path,dataBuffer,function(err){  //path为本地路径例如public/logo.png
                if(err){console.log('保存出错！')}else{
                    console.log('保存成功!')
                }
            });
            apis.darknet('TEMP','temp',1,function(){
                apis.tailor('TEMP','temp',1,function(tailor){
                    // console.log(tailor + "----------------------------------------------------------");
                    if(tailor==1){
                        str = 'Please take photo again';
                        response.write(str);
                        response.end();
                    }
                    else{
                        apis.verify(params.name,function(verification){
                            if(verification==0){
                                response.write("success");
                                response.end();
                            }
                            else{
                                str = 'You are not ' + params.name;
                                response.write(str);
                                response.end();
                            }
                        });
                    }
                });
            });
        }
    })
};

function onRequest(request, response) {

    response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    // 解析URL参数
    // console.log(request);

    var params = url.parse(request.url, true).query;

    console.log(params);
    // 返回当前拥有的imgs
    if(params.type == 1){
        // console.log(params);
        // console.log(params.name);

        var left = getPic(params.name, true);
        var right = getPic(params.name, false);
        var str = {'left':left, 'right':right};
        str = JSON.stringify(str);
        // console.log(str);
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

    // ADD图片
    if(params.type == 4){
        var imgId = parseInt(params.max)+1;
        var imgName = apis.dataLeftCompleting(5, '0', imgId);
        console.log(imgName);
        var path = __dirname + "/pyScripts/data/" + params.name + '/' + params.hand + '/' + imgName +'.jpg';
        var txtPath = __dirname + "/pyScripts/data/" + params.name + '/' + params.hand + '/' + imgName +'.txt';

        var base64Data = params.url.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFileSync(path,dataBuffer,function(err){  //path为本地路径例如public/logo.png
            if(err){console.log('保存出错！')}else{
                console.log('保存成功!')
            }
        });

        apis.darknet(params.name,params.hand, imgId,function(){
            apis.tailor(params.name,params.hand, imgId,function(tailor){
                console.log(tailor + "----------------------------------------------------------");
                if(tailor==1){
                    str = 'Please take photo again';
                    fs.unlink(txtPath, function(err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log(".txt删除成功！");
                    });
                    response.write(str);
                    response.end();
                }
                else{
                    response.write("success");
                    response.end();
                }
            });
        });

    }

    // 存储TEMP图片并验证
    if(params.type == 5){
        var path = __dirname + "/pyScripts/data/TEMP/temp/00001.jpg";
        // console.log(params.url);

        var base64Data = params.url.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFileSync(path,dataBuffer,function(err){  //path为本地路径例如public/logo.png
            if(err){console.log('保存出错！')}else{
                console.log('保存成功!')
            }
        });
        apis.darknet('TEMP','temp',1,function(){
            apis.tailor('TEMP','temp',1,function(tailor){
                // console.log(tailor + "----------------------------------------------------------");
                if(tailor==1){
                    str = 'Please take photo again';
                    response.write(str);
                    response.end();
                }
                else{
                    apis.verify(params.name,function(verification){
                        if(verification==0){
                            response.write("success");
                            response.end();
                        }
                        else{
                            str = 'You are not ' + params.name;
                            response.write(str);
                            response.end();
                        }
                    });
                }
            });
        });
    }

}



// createServer.listen(8080,"192.168.43.222");
createServer.listen(8080,"192.168.43.55");

// console.log('Server running  at http://192.168.43.222:8080/');
console.log('Server running  at http://192.168.43.55:8080/');

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





