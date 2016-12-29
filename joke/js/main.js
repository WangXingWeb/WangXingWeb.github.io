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
        dataType: 'jsonp',
        data: {
            "showapi_timestamp": formatterDateTime(), //注意要使用当前时间。服务器只处理时间误差10分钟以内的请求
            "showapi_appid": '29541', //这里需要改成自己的appid
            "showapi_sign": '3fd121b3d11845d3bddd36c8e2a6bd6a',  //这里需要改成自己的密钥
            "page":page,
            "maxResult":num,
        },
        jsonp: 'jsonpcallback',
        error: function(XmlHttpRequest, textStatus, errorThrown) {
            alert("操作失败!");
        },
        success: function(result) {
            console.log(result);
            number+=num;
            pages=page+1;
            console.log(pages);
            var arry=result.showapi_res_body.contentlist;
            if(type==1){
                for(var i=0;i<arry.length;i++){
                    container.append('<div class="content"><h5 class="img-title">'+arry[i].title+'</h5><img  class="imgJoke"  src="'+arry[i].img+'" /><hr class="divider"/> ');
                }
            }else{
                for(var i=0;i<arry.length;i++){
                    container.append('<div class="content"><h5 class="img-title">'+arry[i].title+'</h5><hr class="divider"/> <p class="textJoke"> '+arry[i].text+'</p><hr class="divider"/>');
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
window.onload=function() {
    http(url, 1,5);
    var prev=document.getElementById('prev');
    prev.onclick = function () {
        if (animated) {
            return;
        }else {
            index-=1;
        }
        animate(360,1);

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
        animate(-1*360,1);
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
        animate(-10*360,2);
    }
    document.getElementById('nextTweny').onclick = function () {
        if (animated) {
            return;
        }else {
            index+=20;
            if(index+22>=number){
                http(url,pages,20);

            }
        }
        animate(-20*360,3);
    }
    document.getElementById('prevTen').onclick = function () {
        if (animated) {
            return;
        }else if(index<11){
            alert("前面没那么多了！");
            return;
        }else{
            index-=10;
        }
        animate(10*360,2);
    }
    document.getElementById('prevTwenty').onclick = function () {
        if (animated) {
            return;
        }else if(index<21){
            alert("前面没那么多了！");
            return;
        }else{
            index-=20;
        }
        animate(20*360,3);
    }
    
    var startx=0;
    var starty=0;
    var endx=0;
    var endy=0;
    //documentWidth=window.screen.availWidth;
    document.addEventListener("touchstart",function(event){
        startx=event.touches[0].pageX;
        starty=event.touches[0].pageY;;
    });

    document.addEventListener('touchmove',function(event){
        event.preventDefault();
    });
    document.addEventListener("touchend",function(event){
        endx=event.changedTouches[0].pageX;
        endy=event.changedTouches[0].pageY;

        var deltax=endx-startx;
        var deltay=endy-starty;

        if(Math.abs(deltax)<0.01*documentWidth && Math.abs(deltay)<0.01*documentWidth){
            return;
        }
        //x
        if(Math.abs(deltax)>=Math.abs(deltay)){
            if(deltax>0){
                /*if(index==1){
                 alert("当前已是最新的了！");
                 return;
                 }*/
                prev.onclick();
            }else{
                next.onclick();

            }
        }

    });}


