var $divs = $('body').find('div');

$(window).on('scroll', function() {
    $divs.each(function(i, elem) {
        if ($(document).scrollTop() + $(window).height() >= $(this).position().top) {
            var $img = $(this).find('img').eq(0);
            $img.prop({src: $img.attr('data-loadPic')});
        }
    });
});
