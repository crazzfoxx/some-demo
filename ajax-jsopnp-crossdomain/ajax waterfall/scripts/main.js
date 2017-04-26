// 获取元素
var $list = $('.list', 'body').eq(0),
    $lis = $list.find('li');
// 初始化每列高度
var lisHeight = [0, 0, 0, 0];
// 初始化图片显示页
var page = 1;
// 设置ajax请求锁
var ajaxLock = true;

fetchImages();

window.onscroll = function() {
    if ($(document).scrollTop() + $(window).height() > getShortestLi().min) {
        ajaxLock && fetchImages();
    }
};

function fetchImages() {
    ajaxLock = false;

    $.ajax({
        url: 'php/getPics.php',
        data: { cpage: page }
    }).done(function(d) {
        var datas = JSON.parse(d);
        if (!datas.length) return;
        for (var i=0,len=datas.length;i<len;i++) {
            var minIdx = getShortestLi().minIdx;
            var cData = datas[i],
                cTitle = cData.title,
                cWidth = 220,
                cHeight = cData.height * 220 / cData.width;

            var $div = $('<div/>');
            $('<img/>').prop('src', cData.preview).css({
                width: cWidth,
                height: cHeight
            }).appendTo($div);
            $('<p/>').html(cData.title).appendTo($div);
            $div.appendTo($lis.eq(minIdx));

            lisHeight[minIdx] += cHeight;
        }

        page++;
        ajaxLock = true;
    });
}

function getShortestLi() {
    var min = lisHeight[0],
        minIdx = 0;
    for (var i=1;i<lisHeight.length;i++) {
        if (lisHeight[i] < min) {
            min = lisHeight[i];
            minIdx = i;
        }
    }
    return {min, minIdx};
}
