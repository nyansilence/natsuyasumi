$(function () {
  'use strict';
  var jsonPath = '';
  // path が"shops{_aaaa}.html"を含む場合にjson取得
  if (location.pathname.match(/.*\/shops_?([a-zA-Z])*.html/)) {
    jsonPath = location.pathname.replace(/shops_?([a-zA-Z])*.html/, "events.json");
  }
  $.ajax({
    type: 'GET',
    url: jsonPath,
    dataType: 'json',
    success: function (data) {
      for (var i in data) {
        var html = '';
        var schedule = data[i].schedule;
        var path = data[i].path;
        var image = data[i].image;
        for (var j in data[i].floorTag) {
          var floorTagId = data[i].floorTag[j].id.replace(':', '\\:').replace(/\//g, '\\/');
          var output = $('#' + floorTagId);
          var slideNum = output.find('.floor-item__slide').length;
          // scheduleがonでスライドの数が6未満だったら要素を作成して出力
          if (schedule == 'on' && slideNum < 6) {
            // 要素を作成
            html = '<div class="floor-item__slide">\n' +
              '<div class="floor-item__slide__img">\n' +
              '<div class="floor-item__slide__bg-img" style="background-image: url(' + image + ');">\n' +
              '<img src="' + image + '" alt="' + data[i].navTitle + '">\n' +
              '</div>\n' +
              '</div>\n' +
              '<div class="floor-item__slide__infomation">\n' +
              '<p class="floor-item__slide__text">' + data[i].navTitle + '</p>\n' +
              '</div>\n' +
              '<a href="' + path + '.html" class="box-link"></a>\n' +
              '</div>\n';
            // 出力
            output.append(html);
          } else {
            continue;
          }
        }
      }
      floor();
    }
  });
});
function floor() {
  (function ($, document, window) {
    "use strict";
    window.APP = window.APP || {};
    window.APP.TEST = window.APP.TEST || {};

    (function ($_GLOBAL, $_LOCAL) {

      // ::::::::::::::::::::::::::::::::::::::::
      // GLOBAL SETTING
      // ::::::::::::::::::::::::::::::::::::::::

      // ::::::::::::::::::::::::::::::::::::::::
      // LOCAL SETTING
      // ::::::::::::::::::::::::::::::::::::::::

      // ::::::::::::::::::::::::::::::::::::::::
      // FUNCTIONS
      // ::::::::::::::::::::::::::::::::::::::::

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

        $trigger.on('click', function () {
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
}