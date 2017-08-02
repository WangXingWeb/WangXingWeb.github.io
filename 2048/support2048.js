/**
 * Created by Administrator on 2016/7/18.
 */



function getPosTop(i,j){
    return cellSpace+i*(cellSideLength+cellSpace);
}
function getPosLeft(i,j){
    return cellSpace+j*(cellSideLength+cellSpace);
}

function getNumberBackgroundColor(number){
    switch (number){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
        case 16384:return "#660597";break;
        case 32768:return "#a70551";break;
        case 65536:return "#fa0813";break;
    }
    return "black";
}
function getFontSize(number){
    switch (number){
        case 2:return    0.55*cellSideLength+'px';break;
        case 4:return    0.55*cellSideLength+'px';break;
        case 8:return    0.55*cellSideLength+'px';break;
        case 16:return   0.55*cellSideLength+'px';break;
        case 32:return   0.55*cellSideLength+'px';break;
        case 64:return   0.55*cellSideLength+'px';break;
        case 128:return  0.48*cellSideLength+'px';break;
        case 256:return  0.48*cellSideLength+'px';break;
        case 512:return  0.48*cellSideLength+'px';break;
        case 1024:return 0.38*cellSideLength+'px';break;
        case 2048:return 0.38*cellSideLength+'px';break;
        case 4096:return 0.38*cellSideLength+'px';break;
        case 8192:return 0.38*cellSideLength+'px';break;
        case 16384:return 0.30*cellSideLength+'px';break;
        case 32768:return 0.30*cellSideLength+'px';break;
        case 65536:return 0.30*cellSideLength+'px';break;
    }
}

function getNumberColor(number){
    if(number<=4){
        return '#776e65';
    }
    return "white";
}

function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

function canMoveLeft(board){
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if (board[i][j]!=0){
                if(board[i][j-1]==0 || board[i][j-1]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveRight(board){
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if (board[i][j]!=0){
                if(board[i][j+1]==0 || board[i][j+1]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveUp(board){
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if (board[i][j]!=0){
                if(board[i-1][j]==0 || board[i-1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board){
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if (board[i][j]!=0){
                if(board[i+1][j]==0 || board[i+1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row,col1,col2,board){
    for(var i=col1+1;i<col2;i++){
        if(board[row][i]!=0){
            return false;
        }
    }
    return true;
}
function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}

function nomove(board){
    if(canMoveLeft(board)||canMoveRight(board)||canMoveUp(board)||canMoveDown(board)){
        return false;
    }
    return true;
}
//给Date对象扩展format方法
Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()// millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//数据库方法
//初始化数据库
function initDB(){
    var dbName = 'dbLocal';
    var version = '1.0';
    var displayName = '分数记录';
    var maxSize = 1024*1024;
    dbLocal = window.openDatabase(dbName, version, displayName, maxSize);
}
//创建表
function createTables(){
    var query = 'CREATE TABLE IF NOT EXISTS scorelist(id INTEGER NOT NULL,username TEXT NOT NULL,score INTEGER NOT NULL,creatime TEXT NOT NULL);';
    try {
        dbLocal.transaction(function(transaction){
            transaction.executeSql(query, [], null, null);
        });
    }
    catch (e) {
        console.log("create table failed");
        layer.msg("系统出错！记录未能保存成功！",{time: 2000, icon:2});
        return;
    }
}
//给scorelist表中插入一条数据
function insertRecord() {
    var idNum = new Date().getTime();
    var creatime=new Date();
    try {
        dbLocal.transaction(function(transaction){
            transaction.executeSql("insert into scorelist(id,username,score,creatime) values(?,?,?,?)", [idNum,userName,score,creatime]);
        });
        layer.msg('记录保存成功！', {time: 2000, icon:6});
    }
    catch (e) {
        console.log("insert into failed");
        layer.msg("系统出错！记录未能保存成功！",{time: 2000, icon:2});
        return;
    }
}
//保存分数记录
function saveScore() {
    layer.prompt({
        formType: 0,
        value: '',
        btn: ['确定'],
        title: '请输入昵称'
    }, function (value, index, elem) {
        userName = value;
        insertRecord();
        $(".layui-layer-close").click();
    });
}
//显示记录
function showRecordList() {
    var content=doContent();
    layer.open({
        type: 1,
        title:'历史记录',
        skin: 'layui-layer-molv', //加上边框
        area: ['90%', '80%'], //宽高
        content: content
    });
}
//填充记录弹出框内容
function doContent() {
    var content='';
    content+='<table cellpadding="0" cellspacing="0"><thead><tr><th>昵称</th><th>分数</th><th>时间</th></tr></thead><tbody>';
    for (var i=0;i<dbData.length;i++){
        content+='<tr><td>'+dbData[i].userName+'</td><td>'+dbData[i].score+'</td><td>'+dbData[i].creaTime+'</td></tr>';
    }
    content+='</tbody></table>';
    console.log(content);
    return content;
}
//从数据库中查记录
function selectRecord() {
    dbLocal.transaction(function(tx) {
        tx.executeSql("select * from scorelist", [],
            function(tx, result) {
                dbData=[];
                for(var i = 0; i < result.rows.length; i++){
                    var thisTiem=result.rows.item(i)['creatime'];
                    thisTiem = thisTiem.replace(/ GMT.+$/, '');
                    var d = new Date(thisTiem);
                    thisTiem=d.format("yyyy-MM-dd hh:mm");
                    console.log(thisTiem);
                    var josnItem={
                        id:result.rows.item(i)['id'],
                        userName:result.rows.item(i)['username'],
                        score:result.rows.item(i)['score'],
                        creaTime:thisTiem
                    }
                    dbData.push(josnItem);
                }
                showRecordList();
                console.log(dbData);
            }, function(){
                alert("error");
            }
        );
    });
}
//获取最好成绩
function getBestScore(){
    dbLocal.transaction(function(tx) {
        tx.executeSql("select max(score) from scorelist", [],
            function(tx, result) {
                alert("4");
                alert(result);
                console.log(result);

                bestScore=result.rows["0"]["max(score)"];


                console.log(bestScore);
                alert(bestScore);
                $("#bestScore").text(bestScore);
            }, function(){
                alert("error");
            }
        );
        alert("2");
    });
    alert("3");
}
//超过最好成绩则best值跟着当前score变化
function isChangeBest(){
    if(bestScore<score){
        bestScore=score;
        $("#bestScore").text(bestScore);
    }
}