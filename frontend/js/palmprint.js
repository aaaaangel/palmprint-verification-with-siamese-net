var $All = function(sel) {
    return document.querySelectorAll(sel);
};

var name = sessionStorage.getItem('name');
var left;
var right;
var timerId;

function update(){
    document.getElementById('name').innerHTML = name;
    var left_list = document.getElementById('left-list');
    left_list.innerHTML = "";
    var right_list = document.getElementById('right-list');
    right_list.innerHTML = "";
    ajax();
    upList(left.data, "left");
    upList(right.data, "right");

}

function upList(data, hand){
    dom = document.getElementById(hand+'-list');
    if(data.length==0){
        dom.innerHTML = "There is no palmprint picture";
    }
    else{
        var ol = document.createElement('ol');
        data.forEach(function(item, index){
            var li  = document.createElement('li');
            li.innerHTML = 'palmprint ' + item;

            li.addEventListener("touchstart", touchFn);
            li.addEventListener("touchend", touchFn);
            var oldTouch;

            function touchFn(ev){
                switch (ev.type){
                    case "touchstart" : 
                        oldTouch = ev.changedTouches[0];
                        break;
                    case "touchend" :
                        var newTouch = ev.changedTouches[0];
                        // 右滑>100删除
                        if(newTouch.clientX - oldTouch.clientX > 150){
                            // console.log("delete"+item);
                            // if(hand=="left"){
                            //     if(parseInt(item)==left.max){

                            //     }
                            // }
                            if(confirm('确定删除'+item+'?')){
                                ajaxDelete(item, hand);
                                update();
                            }
                            // data.splice(index, 1);
                        }
                        break;
                }
            }

            ol.appendChild(li);
        });
        
        dom.appendChild(ol);
    }
}

window.onload = function(){
    var palmprint = document.getElementById('return');
    palmprint.addEventListener('click', function(){
        window.location.href="index.html";
    },false);

    var change_name = document.getElementById('name');
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

function ajax(){
    $.ajax({
        type: "get",
        async: false,
        url: 'http://127.0.0.1:8080/',
        data: {"type":1 , "name": name},
        success:function(response){
            // alert(response);
            var temp = JSON.parse(response);
            left = temp.left;
            // alert(left);
            right = temp.right;
        }
    });
};

function ajaxDelete(del, hand){
    $.ajax({
        type: "get",
        async: false,
        url: 'http://127.0.0.1:8080/',
        data : {"type":2,"name":name, "hand": hand, "filename": del},
        success:function(response){

        }
    });
};