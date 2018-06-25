var $All = function(sel) {
    return document.querySelectorAll(sel);
};

var ip = "http://192.168.43.222:8080/";
var name = sessionStorage.getItem('name');
function wrName(){
    var temp = "";
    while(temp==""){
        temp = prompt("Please write your username:");
    }
    name = temp;
}

window.onload = function(){
    var palmprint = document.getElementById('palmprint-box');
    palmprint.addEventListener('click', function(){
        window.location.href="palmprint.html";
    },false);

    var ver = this.document.getElementById('verification-box');
    ver.addEventListener('click', function(){
        window.location.href="camera.html";
    },false);

    while(name==""||name=="null"){
        wrName();
    }
    sessionStorage.setItem('name',name);
}
