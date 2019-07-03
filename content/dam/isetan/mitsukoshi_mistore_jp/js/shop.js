(function($, document, window) {
  "use strict";
  window.APP = window.APP || {};
  window.APP.SHOP = window.APP.SHOP || {};

  (function($_GLOBAL, $_LOCAL) {

    // ::::::::::::::::::::::::::::::::::::::::
    // GLOBAL SETTING
    // ::::::::::::::::::::::::::::::::::::::::

    // ::::::::::::::::::::::::::::::::::::::::
    // LOCAL SETTING
    // ::::::::::::::::::::::::::::::::::::::::



    // ::::::::::::::::::::::::::::::::::::::::
    // FUNCTIONS
    // ::::::::::::::::::::::::::::::::::::::::

    (function itemSlider() {
      let isSliderActive = false;
      let $itemSlider = $('.item-slider');
      let $slider = $('.item-slider__items');
      let $viewmore = $('.item-slider__viewmore');

      $itemSlider.each(function() {
        let $this = $(this);
        let $viewmore = $(this).find('.item-slider__viewmore');
        let $btn = $(this).find('.ci-btn');

        $viewmore.on('click', function() {
          $(this).fadeOut(400);
          $btn.fadeIn(400);
          $this.find('.item-slider__item').fadeIn(400);
        });

      });
    })();

    (function ankerLinkBar() {
      let $bar = $('#ankerLinkBar');
      let $items = $bar.find('.anker-link-bar__items');
      let $item = $bar.find('.anker-link-bar__item');
      let offsetTop;
      var scroll_top;
      var tmp_scroll_top = 0;

      let itemsWidth = 0;

      $(window).on('load resize scroll', function() {

        if($bar.length) {
          scroll_top = $_GLOBAL.VAR.scrollTop;
          offsetTop = $bar.offset().top;

          if($_GLOBAL.VAR.scrollTop > offsetTop) {
            $bar.addClass('is-fixed');
          } else {
            $bar.removeClass('is-fixed');
          }
        }

      });

    })();

    (function catalogSlickSlider() {
        let $base = $('#catalog .js-slick-slide');
        $base.each(function() {
            let $slider = $(this).find('.js-slick-slide__slider');
            let $inner = ($(this).find('.js-slick-slide__inner').length) ? $(this).find('.js-slick-slide__inner') : $slider;
            let $wrapper = $inner.parent('div.sectioning');
            let minWidth = parseInt($('body').css('min-width'));
            let slideOption = {
                arrows: true,
                dots: true,
                autoplay: false,
                autoplaySpeed: 5000,
                easing: 'easeInOutQuad',
                speed: 600,
                slidesToShow: 2,
                slidesToScroll: 2,
                appendArrows: $inner,
                touchThreshold: 20
            };
            $(window).on('load resize', function() {
                let windowWidth = $(window).width();
                let wrapperWidth = windowWidth < minWidth ? minWidth : windowWidth;
                $wrapper.width(wrapperWidth);
                $slider.find('.catalog-list__item').each(function() {
                    $(this).css('height', '97%');
                });
                $slider.slick('unslick');
                if ($_GLOBAL.VAR.device < 3) {
                    $slider.slick(slideOption);
                }
                $slider.css('opacity', 1);
            });
        });
    })();

  })(window.APP, window.APP.SHOP);


})(jQuery, document, this);
