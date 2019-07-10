if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
    $('body').on("mousewheel", function () {
        // remove default behavior
        event.preventDefault(); 

        //scroll without smoothing
        var wheelDelta = event.wheelDelta;
        var currentScrollPosition = window.pageYOffset;
        window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
}

$('.mod-background').css({top: $('.breadcrumb').offset().top + $('.breadcrumb').height(), height: 'calc(100vh - ' + $('.mod-banner').offset().top + ')'})

$(window).scroll(function() {
    if($('#globalHeader').hasClass('is-fixed')) {
        $('.mod-background').css({top: 0})
    } else {
        $('.mod-background').css({top: $('.breadcrumb').offset().top + $('.breadcrumb').height()})
    }
})

// $(document).ready(function(){
//     var $top
//     var $height
//     // if($('.mod-banner')) {
//     $top = $('.mod-banner').offset().top
//     $height = $('.mod-banner').height()
//     // }

//     $('.bg-background').css({top: $top, height: $height})
// })

