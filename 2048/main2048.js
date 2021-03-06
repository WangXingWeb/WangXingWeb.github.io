/**
 * Created by Administrator on 2016/7/18.
 */
var board=new Array();
var score=0;
//防止一个cell重复叠加
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
var userName="";
var dbData=new Array();
var bestScore=0;
//最高值的cell
var heighestCell=0;
//打破最好成绩的提醒
var isBreakBestRecord=false;

documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;

$(document).ready(function(){
    prepareForMobile();
    //初始化棋盘
    init();
    isSaved();
    initDB();
    createTables();
    getBestScore();
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
    starty=event.touches[0].pageY;
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

function gameover(){
    $("#saveBoard").hide();
    $("#backRecord").hide();
    /*layer.alert('Game over!', {
        title:'提示',
        icon: 2,
        skin: 'layer-ext-moon'
    });*/
    layer.confirm('Game over!，是否记录这次游戏的分值？', {
        title:'提示',
        btn: ['保存','取消'] //按钮
    }, function(){
        $(".layui-layer-close").click();
        saveScore();
    }, function(){
        $(".layui-layer-close").click();
    });
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
                        encourage(board[i][k]);
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
                        encourage(board[i][k]);
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
                        encourage(board[k][j]);
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
                        encourage(board[k][j]);
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
            skin: 'layui-layer-my',
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
        backStepNum:backStepNum,
        heighestCell:heighestCell,
        isBreakBestRecord:isBreakBestRecord
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
    heighestCell=savedRecord.heighestCell;
    isBreakBestRecord=savedRecord.isBreakBestRecord;
    showBackRecord();
    updateBoardView();
}
//创建新游戏
function creatNewGame() {
    if(!(nospace(board) && nomove(board))&&stepNumber>10){
        layer.confirm('新建游戏将清除当前记录，确定创建新游戏吗', {
            title:'提示',
            skin: 'layui-layer-my',
            btn: ['取消','新游戏'] //按钮
        }, function(){
            $(".layui-layer-close").click();
        }, function(){
            newgame();
            getBestScore();
            $(".layui-layer-close").click();
        });
    }else{
        newgame();
    }
}
//提示鼓励信息
function encourage(num) {
    if(num>heighestCell){
        switch (num){
            case 512: layer.msg('哎呦，不错哦！继续加油！', {time: 2000, icon:6});heighestCell=num; break;
            case 1024: layer.msg('很不错嘛！继续加油！', {time: 2000, icon:6});heighestCell=num; break;
            case 2048: layer.msg('达成2048，好厉害！', {time: 2000, icon:6});heighestCell=num; break;
            case 4096: layer.msg('顶级高手难逢敌手！', {time: 2000, icon:6});heighestCell=num; break;
            case 8192: layer.msg('笑傲江湖独步武林！', {time: 2000, icon:6});heighestCell=num; break;
            case 16384: layer.msg('开发者被你打败了！', {time: 2000, icon:6});heighestCell=num; break;
            case 32768: layer.msg('你就是神！', {time: 2000, icon:6});heighestCell=num; break;
            case 65536: layer.msg('你做到了极致！攻城狮佩服的五体投地', {time: 2000, icon:6});heighestCell=num; break;
        }
    }

}



