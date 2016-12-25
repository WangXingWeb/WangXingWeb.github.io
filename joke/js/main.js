var container=$("#myContainer");
var index=1;

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

function openDialog() {
    alert("感谢您访问我的网站，这是我利于闲暇时间制作的搞笑类网站，暂时功能还不够完善，今后我会尽快弥补，希望您能谅解。网站的后台接口由易源数据提供，在此对易源数据表示感谢！");
}

function http(url,index) {
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'jsonp',
        data: {
            "showapi_timestamp": formatterDateTime(), //注意要使用当前时间。服务器只处理时间误差10分钟以内的请求
            "showapi_appid": '29541', //这里需要改成自己的appid
            "showapi_sign": '3fd121b3d11845d3bddd36c8e2a6bd6a',  //这里需要改成自己的密钥
            "page":index,
            "maxResult":'1',
        },
        jsonp: 'jsonpcallback',
        error: function(XmlHttpRequest, textStatus, errorThrown) {
            alert("操作失败!");
        },
        success: function(result) {
            console.log(result);//console变量在ie低版本下不能用
            var list=document.getElementById("myContainer");
            list.removeChild(list.childNodes[2]);

            var arry=result.showapi_res_body.contentlist;
            for(var i=0;i<arry.length;i++){
                container.append('<div class="content"><img class="imgJoke" id="imgId" src="'+arry[i].img+'" /><h5 class="img-title">'+arry[i].title+'</h5><hr class="divider"/> ');
            }
            console.log(index);
        }
    });
}

