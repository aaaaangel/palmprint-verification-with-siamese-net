var $ = function(sel) {
    return document.querySelector(sel);
};
var $All = function(sel) {
    return document.querySelectorAll(sel);
};

var name = sessionStorage.getItem('name');
function wrName(){
    var temp = "";
    while(temp==""){
        temp = prompt("Please write your username:");
    }
    name = temp;
}

window.onload = function(){
    var palmprint = $('#palmprint-box');
    palmprint.addEventListener('click', function(){
        window.location.href="palmprint.html";
    },false);

    var ver = $('#verification-box');
    ver.addEventListener('click', camera, false);

    while(name==""||name=="null"){
        wrName();
    }
    sessionStorage.setItem('name',name);
}
