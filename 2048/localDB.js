/**
 * Created by wangxing on 2017/8/3.
 */
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
        layer.msg("系统出错！记录未能保存成功！",{time: 2000, icon:2});
        return;
    }
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
                    var josnItem={
                        id:result.rows.item(i)['id'],
                        userName:result.rows.item(i)['username'],
                        score:result.rows.item(i)['score'],
                        creaTime:thisTiem
                    }
                    dbData.push(josnItem);
                }
                showRecordList();
            }, function(){
                layer.msg("获取历史记录出错！",{time: 2000, icon:2});
            }
        );
    });
}
//获取最好成绩
function getBestScore(){
    dbLocal.transaction(function(tx) {
        tx.executeSql("select max(score) from scorelist", [],
            function(tx, result) {
                bestScore=result.rows.item(0)['max(score)'];
                if(bestScore){
                    $("#bestScore").text(bestScore);
                }else{
                    $("#bestScore").text("暂无");
                }
            }, function(){
                layer.msg("获取最好成绩出错！",{time: 2000, icon:2});
            }
        );
    });
}