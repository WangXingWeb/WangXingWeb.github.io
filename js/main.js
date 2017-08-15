window.onload=function(){
    /*以下是banner轮播图的JavaScript代码*/
    //获得对象
    var container=document.getElementById("container");
    var list=document.getElementById("list");
    var buttons=document.getElementById("buttons").getElementsByTagName("span");
    var prev=document.getElementById("prev");
    var next=document.getElementById("next");
    var index=1;
    var animated=false;
    var timer;
    var reading=document.getElementsByClassName("reading-box");

    for (var i=0;i<buttons.length;i++) {
        buttons[i].onclick= function () {
            if (animated) {
                return;
            }
            if(this.className=="on"){
                return;
            }
            var myIndex=parseInt(this.getAttribute("index"));
            var offset=-1000*(myIndex-index);
            animate(offset);
            index=myIndex;
            showButton();
        };
    }
    //自动播放功能
    function play (){
        timer=setInterval(function(){
            next.onclick();
        },5000);
    }
    function stop(){
        clearInterval(timer);
    }
    function showButton(){
        //去掉之前的红点
        for(var i=0;i<buttons.length;i++){
            if(buttons[i].className=="on"){
                buttons[i].className="";
                break;
            }
        }
        //给当前加红点
        buttons[index-1].className="on";
    }
    //向右切换图片，向animate();传递-1200作为参数
    next.onclick=function(){
        if (animated) {
            return;
        }
        if(index==5){
            index=1;
        }else {
            index+=1;
        }

        showButton();
        animate(-1000);
    }
    //向左切换图片，向animate();传递1200作为参数
    prev.onclick=function(){
        if (animated) {
            return;
        }
        if(index==1){
            index=5;
        }else {
            index-=1;
        }
        showButton()
        animate(1000);
    }
    //切换图函数，向左向右切换分别传递1000和-1000作为参数
    function animate(offset){
        animated=true;
        var newLeft=parseInt(list.style.left)+offset;
        var time=500;//位移总时间
        var interval=10;//位移间隔
        var speed=offset/(time/interval);//每次位移量
        function go(){
            if(parseInt(list.style.left)!=newLeft){
                list.style.left=parseInt(list.style.left)+speed+"px";
                setTimeout(go,interval);
            }else{
                animated=false;
                list.style.left=newLeft+'px';
                //当图片切换到图片5的附属图时切换到图片5显示的位置
                if(newLeft>-1000){
                    list.style.left=-5000+"px";
                }
                //当图片切换到图片1的附属图时切换到图片1显示的位置
                if(newLeft<-5000){
                    list.style.left=-1000+"px";
                }
            }
        }
        go();

    }

    //容器添加鼠标移入移出监听器，分别调用play和stop方法
    container.onmouseover=stop;
    container.onmouseout=play;

    //新打开处于播放状态，调用play方法
    play();
}
/*导航栏关于显示对话框*/
function openDialog(){
    alert("您好，这是我的个人网站，这是一个还在开发中的网站，功能和体验还不完整，我会尽快完善！希望您谅解!");
}
/*弹出兴趣隐藏栏代码*/
var readingbox=document.getElementsByClassName("reading-box");
var basketballbox=document.getElementsByClassName("basketball-box");
var tourismbox=document.getElementsByClassName("tourism-box");
var moivesbox=document.getElementsByClassName("moives-box");
function display(number){
    if(number==1){
        basketballbox[0].style.display="none";
        tourismbox[0].style.display="none";
        moivesbox[0].style.display="none";
        readingbox[0].style.display="block";
    }else if(number==2){
        tourismbox[0].style.display="none";
        moivesbox[0].style.display="none";
        readingbox[0].style.display="none";
        basketballbox[0].style.display="block";
    }else if(number==3){
        moivesbox[0].style.display="none";
        readingbox[0].style.display="none";
        basketballbox[0].style.display="none";
        tourismbox[0].style.display="block";
    }else if(number==4){
        readingbox[0].style.display="none";
        basketballbox[0].style.display="none";
        tourismbox[0].style.display="none";
        moivesbox[0].style.display="block";
    }
}
<!--添加fixed板块脚本-->
jQuery(document).ready(function($){
    $('#backtop').click(function(){$('html,body').animate({scrollTop: '0px'}, 500);});
    var abouttop=$('#about-me').position().top;
    var buttonabout=$('#back-about');
    buttonabout.click(function(){$('html,body').animate({scrollTop: abouttop}, 500);});
    var worktop=$('#my-work').position().top;
    $('#back-work').click(function(){$('html,body').animate({scrollTop: worktop}, 500);});
    var interesttop=$('#my-interest').position().top;
    $('#back-interest').click(function(){$('html,body').animate({scrollTop: interesttop}, 500);});
    function backabout(){buttonabout.onclick();}
});
