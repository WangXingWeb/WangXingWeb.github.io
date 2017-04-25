/**
 * Created by wangxing on 2017/4/8.
 */
mui.init();
//侧滑容器父节点
var offCanvasWrapper = mui('#offCanvasWrapper');
//主界面容器
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
//菜单容器
var offCanvasSide = document.getElementById("offCanvasSide");
//移动效果是否为整体移动
var moveTogether = false;
//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
var classList = offCanvasWrapper[0].classList;
//变换侧滑动画移动效果；
offCanvasSide.classList.remove('mui-transitioning');
offCanvasSide.setAttribute('style', '');
classList.remove('mui-slide-in');
classList.remove('mui-scalable');
classList.add('mui-slide-in');
offCanvasWrapper.offCanvas().refresh();
//菜单界面，‘关闭侧滑菜单’按钮的点击事件
document.getElementById('offCanvasHide').addEventListener('tap', function() {
    offCanvasWrapper.offCanvas('close');
});
//主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
//实现ios平台原生侧滑关闭页面；
if (mui.os.plus && mui.os.ios) {
    mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
        plus.webview.currentWebview().setStyle({
            'popGesture': 'none'
        });
    });
}
$("body").on('tap','a',function (event) {
    this.click();
});
function showQrcode() {
    $('#tblack').show();
    $('#qrcode').show();
}
$("#tblack").on('tap',this,function () {
    $('#tblack').hide();
    $('#qrcode').hide();
});
$("#goBack").click(function () {
    window.history.back()
});
function getListItem(id,url,type,i) {
    $.ajax({
        url: url+id,
        type: 'GET',
        dataType: 'JSONP',
        success: function (data) {
            var strHtml='';
            strHtml+='<ul class="mui-table-view mui-table-view-chevron" style="margin-top: 10px" onclick="window.location.href = \'readingDetail.html?'+type+'?'+i+'\'">';
            strHtml+='<li class="mui-table-view-cell mui-media">';
            strHtml+='<a class="mui-navigate-right listItem">';
            var thisImage;
            if(type=="book"){
                thisImage=data.image;
            }else if(type=="movie"){
                thisImage=data.images.medium;
            }
            strHtml+='<img class="mui-media-object mui-pull-left listItem-img" src="'+thisImage+'">';
            strHtml+='<div class="mui-media-body listItem-body">'+data.title;
            strHtml+='<p class="mui-ellipsis  listItem-p">'+data.summary+'</p>';
            strHtml+='</div></a></li></ul>';
            $("#mui-main-content").append(strHtml);
        },
        fail:function (error) {
            console.log(error);
        }
    });
}