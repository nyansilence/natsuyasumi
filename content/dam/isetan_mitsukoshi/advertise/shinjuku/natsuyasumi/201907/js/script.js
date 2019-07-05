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

// $(document).ready(function(){
//     var $top
//     var $height
//     // if($('.mod-banner')) {
//     $top = $('.mod-banner').offset().top
//     $height = $('.mod-banner').height()
//     // }

//     $('.bg-background').css({top: $top, height: $height})
// })

