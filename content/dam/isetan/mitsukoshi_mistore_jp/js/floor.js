(function($, document, window) {
  "use strict";
  window.APP = window.APP || {};
  window.APP.TEST = window.APP.TEST || {};

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

    (function floorMapImgZoom() {
      let $map = $('#floorMapImg').find('img');

      if($map.length) {
        $map.elevateZoom({
          responsive: true,
          zoomWindowWidth: $('.floor-map__inner').outerWidth() * .4,
          zoomWindowHeight: $('.floor-map').height(),
          borderSize: 0,
          zoomWindowFadeIn: 200,
          zoomWindowFadeOut: 200,
          lensFadeIn: 200,
          lensFadeOut: 200
        });
      }

      $('body').append('<div class="zoom-map-modal" id="zoomMapModal"><div class="zoom-map-modal__close" /></div>');

      let $zoomUpTrigger = $('.floor-map__btn');
      let modalScrollTop;

      $zoomUpTrigger.on('click', function() {
        let $target = $('.floor-map__img');
        modalScrollTop = $(window).scrollTop();

        $target.clone(false, false).appendTo('#zoomMapModal');
        $('#zoomMapModal').fadeIn(400);

        $('body').css({
          position: 'fixed',
          'overflow-y': 'scroll',
          top: -modalScrollTop
        });
      });
      $('.zoom-map-modal__close').on('click', function() {
        $('#zoomMapModal').fadeOut(400, function() {
          $(this).find('.floor-map__img').remove();
        });

        $('body').css({
          position: '',
          'overflow-y': '',
          top: ''
        });
        $(window).scrollTop(modalScrollTop);
        event.stopPropagation();
        return false;
      });


    })();

    (function restrictShopListText() {
      let $shopListText = $('.shop-list__text');

      let textLimit = 80; // カットする文字数

      $shopListText.each(function(){
        let text = $(this).text();
        let textLength = text.length;
        let remainingText = text.substr(0,textLimit);
        let trimingText = text.replace(remainingText, '');

        if(textLimit < textLength) {
          $(this).html('<span class="remaining-text">' + remainingText + '</span>' + '<span class="triming-text">' + trimingText + '</span>');
        }

      });
    })();

    function floorItemSlider() {
      let $slider = $('.floor-item__slider');
      $slider.slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        dots: true
      });
    }
    floorItemSlider();

    (function floorIndexTrigger() {
      let $trigger = $('.floor-index__trigger');

      $trigger.on('click', function() {
        $('.floor-item__slider').slick('unslick');
        $('.floor-item__slider').slick({
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: true,
          dots: true
        });
      });
    })();


  })(window.APP, window.APP.TEST);


})(jQuery, document, this);
