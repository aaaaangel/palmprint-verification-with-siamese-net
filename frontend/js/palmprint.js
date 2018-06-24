var $ = function(sel) {
    return document.querySelector(sel);
};
var $All = function(sel) {
    return document.querySelectorAll(sel);
};

var name = sessionStorage.getItem('name');
var timerId;
function update(){
    $('#name').innerHTML = name;
}
window.onload = function(){
    var palmprint = $('#return');
    palmprint.addEventListener('click', function(){
        window.location.href="index.html";
    },false);

    var change_name = $('#name');
    change_name.addEventListener("touchstart", touchFn);
    change_name.addEventListener("touchmove", touchFn);
    change_name.addEventListener("touchend", touchFn);

    function touchFn(e){
        switch (e.type){
            case "touchstart" :  //500ms之后执行
                timerId = setTimeout(function (){
                    // console.log("长按成功");
                    name = prompt("Please write your username:");
                    while (name=="") {
                        name = prompt("Please write your username:");
                    }
                    if(name=="null"){
                        name = sessionStorage.getItem('name');
                    }
                    sessionStorage.setItem('name',name);
                    update();  
                }, 500)
                break;
            case "touchmove" :
                //如果中间有移动也清除定时器
                clearTimeout(timerId)
                break;
            case "touchend" :
                //如果在500ms之内抬起了手指，则需要定时器
                clearTimeout(timerId);
                break;
        }
    }

    update();
}
