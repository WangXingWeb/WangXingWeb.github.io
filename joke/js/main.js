var container=$("#myContainer");
documentWidth=window.screen.width;
var index=1;
var myContainer=document.getElementById("myContainer");
var animated=false;
var number=0;
var pages=1;
function formatterDateTime() {
    var date=new Date()
    var month=date.getMonth() + 1
    var datetime = date.getFullYear()
        + ""// "年"
        + (month >= 10 ? month : "0"+ month)
        + ""// "月"
        + (date.getDate() < 10 ? "0" + date.getDate() : date
            .getDate())
        + ""
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ""
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
        + ""
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
            .getSeconds());
    return datetime;
}
function http(url,page,num) {
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        data: {
            "showapi_timestamp": formatterDateTime(), //注意要使用当前时间。服务器只处理时间误差10分钟以内的请求
            "showapi_appid": '29541', //这里需要改成自己的appid
            "showapi_sign": '3fd121b3d11845d3bddd36c8e2a6bd6a',  //这里需要改成自己的密钥
            "page":page,
            "maxResult":num
        },
        error: function(XmlHttpRequest, textStatus, errorThrown) {
            alert("操作失败!");
        },
        success: function(result) {
            number+=num;
            pages=page+1;
            //console.log(result);
            var arry=result.showapi_res_body.contentlist;
            if(type==1){
                for(var i=0;i<arry.length;i++){
                    container.append('<div class="content"><h5 class="img-title">'+arry[i].title+'</h5><img  class="imgJoke"  src="'+arry[i].img+'" />');
                }
            }else{
                for(var i=0;i<arry.length;i++){
                    container.append('<div class="content"><h5 class="img-title">'+arry[i].title+'</h5><div class=" line"/> <div class="textJoke"> '+arry[i].text+'</div><div class=" line"/>');
                }
            }
        }
    });
}
function animate(offset,time){
    animated=true;
    var newLeft=parseInt(myContainer.style.left)+offset;
    var time=300*time;//位移总时间
    var interval=30;//位移间隔
    var speed=offset/(time/interval);//每次位移量
    function go(){
        if(parseInt(myContainer.style.left)!=newLeft){
            myContainer.style.left=parseInt(myContainer.style.left)+speed+"px";
            setTimeout(go,interval);
        }else{
            animated=false;
            myContainer.style.left=newLeft+'px';
        }
    }
    go();
}
function alertText(which) {
    var alertDiv;
    if(which==0){
        alertDiv=$("#alertMore");
    }else{
        alertDiv=$("#alertOne");
    }
    alertDiv.show();
    setTimeout(function () {
        alertDiv.hide();
    },2000);
    var tt=index-1;
    animate(tt*320,2);
    console.log(tt);
    index=1;
}
window.onload=function() {
    http(url, 1,5);
    var prev=document.getElementById('prev');
    prev.onclick = function () {
        if (animated) {
            return;
        }else if (index<=1){
            alertText(1);
            return;
        }else{
            index-=1;
        }
        animate(320,1);
    }
    var next=document.getElementById('next');
    next.onclick = function () {
        if (animated) {
            return;
        }else {
            index+=1;
            if(index+2>=number){
                http(url,pages,5);
            }
        }
        animate(-1*320,1);
    }
    document.getElementById('nextTen').onclick = function () {
        if (animated) {
            return;
        }else {
            index+=10;
            if(index+12>=number){
                http(url,pages,10);
            }
        }
        animate(-10*320,2);
    }
    document.getElementById('nextTwenty').onclick = function () {
        if (animated) {
            return;
        }else {
            index+=20;
            if(index+22>=number){
                http(url,pages,20);
            }
        }
        animate(-20*320,4);
    }
    document.getElementById('prevTen').onclick = function () {
        if (animated) {
            return;
        }else if(index<11){
            alertText(0);
            return;
        }else{
            index-=10;
        }
        animate(10*320,2);
    }
    document.getElementById('prevTwenty').onclick = function () {
        if (animated) {
            return;
        }else if(index<21){
            alertText(0);
            return;
        }else{
            index-=20;
        }
        animate(20*320,4);
    }
    var startx=0;
    var starty=0;
    var endx=0;
    var endy=0;
    //documentWidth=window.screen.availWidth;
    document.addEventListener("touchstart",function(event){
        startx=event.touches[0].pageX;
        starty=event.touches[0].pageY;
    });
    document.addEventListener("touchend",function(event){
        endx=event.changedTouches[0].pageX;
        endy=event.changedTouches[0].pageY;
        var deltax=endx-startx;
        var deltay=endy-starty;
        if(Math.abs(deltax)<0.1*documentWidth && Math.abs(deltay)<0.1*documentWidth){
            return;
        }
        //x
        if(Math.abs(deltax)>=Math.abs(deltay)){
            if(deltax>0){
                prev.onclick();
            }else{
                next.onclick();
            }
        }
        var nowHeight=$(document).scrollTop();
        if(Math.abs(deltax)<Math.abs(deltay)){
            if(deltay<0){
                $('body,html').animate({scrollTop:nowHeight-deltay},300);
            }else if(deltay>0){
                $('body,html').animate({scrollTop:nowHeight-deltay},300);
            }
        }
    });
}


