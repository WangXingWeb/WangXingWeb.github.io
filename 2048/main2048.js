/**
 * Created by Administrator on 2016/7/18.
 */
var board=new Array();
var score=0;

var hasConflicted=new Array();

var startx=0;
var starty=0;
var endx=0;
var endy=0;

//添加可以返回上一步功能
var records=new Array();
//计步器
var stepNumber=0;
//返回步数计数器
var backStepNum=0;
//用户返回步数，设置只能返回5次
var allBack=0;

$(document).ready(function(){
    prepareForMobile();
    //初始化棋盘
    init();

    isSaved();
    /*//操作本地数据库
    initDataBase();
    showAllTheDate();*/

});

//适配移动端和pc

function prepareForMobile(){
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }

    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
}

function newgame(){
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    score=0;
    allBack=0;
    stepNumber=0;
    localStorage.setItem("theRecord","");
    updateScore(0);
}
function init(){
    for(var i=0; i<4; i++){
        for(var j=0; j<4;j++){
            var gridCell=$('#grid-cell-'+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
             $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell =$('#number-cell-'+i+'-'+j);
            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('font-size',getFontSize(board[i][j]));
                theNumberCell.css('width','cellSideLength');
                theNumberCell.css('height','cellSideLength');
                theNumberCell.css('top', getPosTop(i,j));
                theNumberCell.css('left', getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);


            }
            hasConflicted[i][j]=false;
        }
    }
    $('.number-cell').css('width',cellSideLength+'px');
    $('.number-cell').css('height',cellSideLength+'px');
    $('.number-cell').css('line-height',cellSideLength+'px');

}

function  generateOneNumber(){
    if(nospace(board)){
        return false;
    }
    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );
    var times=0;
    while(times<50){
        if(board[randx][randy]==0){
            break;
        }
         randx=parseInt(Math.floor(Math.random()*4));
         randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        for(var i= 0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random() < 0.9 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event) {
    switch (event.keyCode){
        case 37:
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

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
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }

        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    //y
    if(Math.abs(deltay)>=Math.abs(deltax)){
        if(deltay>0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }

        }else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});

function isgameover(){
    if(nospace(board) && nomove(board)){
        localStorage.setItem("theRecord","");
        gameover();
    }
}
/*function initDataBase(){
    var db=getCurrentDb();
    if(!db){
        alert("您的浏览器不支持html5本地数据库！");
        return;
    }else{
        db.transaction(function(trans){
            trans.executeSql("create table if not exists Demo(uName text null,uScore integer null,uTimes text null)",[],function(trans,result){},function(trans,message){});
        });
    }
}
function getCurrentDb(){
    var bd=openDatabase("data.db","1.0","demo data",1024*1024);
    return bd;
}*/

function gameover(){
    layer.alert('Game over!', {
        title:'提示',
        icon: 2,
        skin: 'layer-ext-moon'
    });
    $("#saveBoard").hide();
    $("#backRecord").hide();


    //操作本地数据库




    /*var Name=$("#txtName").val();
    var Score=score;
    var date=new Date();
    var Times="";
    Times+=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes();
    var db=getCurrentDb();
    db.transaction(function(trans){
        trans.executeSql("insert into Demo(uName,uScore,uTimes)values(?,?,?)"[Name,Score,Times],function(ts,data){},function(ts,message){
            alert(message);
        });
    });
    showAllTheDate();*/

}

function remove(){
    var db=getCurrentDb();
    db.transaction(function(trans) {
        trans.executeSql("delete from Demo", [], function (ts, data) {
        }, function (ts, message) {
            alert(message);
        });
    });
    showAllTheDate();
}

function showAllTheDate(){
   $("#tblData").empty();//移除表中所有的子元素
    var db=getCurrentDb();
    db.transaction(function(trans){
        trans.executeSql("select * from Demo",[],function(ts,data){
            if(data){
                //循环记录集中的数据
                for(var i=0;i<data.rows.length;i++){
                    //获取每一行数据的json对象(键值对组成)，将数据拼接成表格中的一行行数据
                    appendDataToTable(data.rows.item(i));
                }
            }
        },function(ts,message){
            alert(message);
        });
    });
}
/*//将数据展示到表格中
function appendDataToTable(data){
    var txtName=data.uName;
    var txtScore=data.uScore;
    var txtTimes=data.uTimes;
    var strHtml="";
    strHtml+="<tr>";
    strHtml+="<td>"+txtName+"</td>";
    strHtml+="<td>"+txtScore+"</td>";
    strHtml+="<td>"+txtTimes+"</td>";
    strHtml+="</tr>";
    $("#tblData").append(strHtml);
}*/

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    updateRecord();
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal( i , k , j , board )){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;

                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //addscore
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    record();
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    updateRecord();
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal( i , j , k , board )){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal( i , j , k , board )  && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //addscore
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    record();
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    updateRecord();
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical( j , k , i , board )){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;

                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical( j , k , i , board )  && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //addscore
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    record();
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    updateRecord();
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical( j , i , k , board )){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical(j , i , k  , board )  && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //addscore
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    record();
    return true;
}
function record() {
    setTimeout("updateBoardView()",200);
    stepNumber++;
    if(backStepNum>0){
        backStepNum--;
    }
    showBackRecord();
}
//刷新记录
function updateRecord() {
    //取消应用类型的联动
    records[5]= $.extend(true,{},records[4]);
    records[4]= $.extend(true,{},records[3]);
    records[3]= $.extend(true,{},records[2]);
    records[2]= $.extend(true,{},records[1]);
    records[1]= $.extend(true,{},records[0]);
    records[0]= $.extend(true,{},board);
}
//显示返回上一步按钮
function showBackRecord() {
    if(stepNumber>5){
        $("#backRecord").show();
        $("#saveBoard").show();
    }else{
        $("#saveBoard").hide();
        $("#backRecord").hide();
    }
}
//返回上一步
function backRecord() {
    if(allBack<6){
        board= $.extend(true,{},records[backStepNum]);
        backStepNum++;
        updateBoardView();
        allBack++;
    }else{
        layer.msg('您已返回超过5次，不能再反返回了', {time: 2000, icon:4});
    }
}

//判断是否有记录
function isSaved() {
    if(localStorage.getItem("theRecord")){
        layer.confirm('您有一份存档记录，是否继续？', {
            title:'提示',
            btn: ['继续','新游戏'] //按钮
        }, function(){
            //选择继续则读档
            readRecord();
            $(".layui-layer-close").click();
        }, function(){
            newgame();
            $(".layui-layer-close").click();
        });
    }else{
        newgame();
    }
}
//存档
function saveBoard() {
    localStorage.setItem("theRecord","");
    var theRecord={
        board:board,
        score:score,
        allBack:allBack,
        records:records,
        stepNumber:stepNumber,
        backStepNum:backStepNum
    }
    localStorage.setItem("theRecord",JSON.stringify(theRecord));
    layer.msg('存档成功，下次进入游戏可继续玩！', {time: 2000, icon:6});
}
//读档
function readRecord() {
    var savedRecord=JSON.parse(localStorage.getItem("theRecord"));
    allBack=savedRecord.allBack;
    score=savedRecord.score;
    updateScore(score);
    board=savedRecord.board;
    records=savedRecord.records;
    stepNumber=savedRecord.stepNumber;
    backStepNum=savedRecord.backStepNum;
    showBackRecord();
    updateBoardView();
}
//创建新游戏
function creatNewGame() {
    if(!(nospace(board) && nomove(board))&&stepNumber>10){
        layer.confirm('新建游戏将清除当前记录，确定创建新游戏吗', {
            title:'提示',
            btn: ['取消','新游戏'] //按钮
        }, function(){
            $(".layui-layer-close").click();
        }, function(){
            newgame();
            $(".layui-layer-close").click();
        });
    }else{
        newgame();
    }

}