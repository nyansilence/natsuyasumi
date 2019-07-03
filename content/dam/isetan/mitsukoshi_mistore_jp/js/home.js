(function () {
    var jsonPath = '';
    // jsonのパスを取得
    jsonPath = location.pathname.replace(/.html/, "/events.json");
    $.ajax({
        type: 'GET',
        url: jsonPath,
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = '';
            for (var i in data) {
                var schedule = data[i].schedule;
                var navTitle = data[i].navTitle;
                var path = data[i].path + ".html";
                var dateFrom = data[i].dateFrom;
                var dateTo = data[i].dateTo;
                var dateFromF = dateFormat(dateFrom);
                var dateToF = dateFormat(dateTo);
                var remainingDay = getRemainingDay(dateTo);
                var image = data[i].image;
                var campaignflag = false;
                var categoryTagId = "";
                var categoryTagTitle = "";
                var floorTagId = "";

                if (data[i].campaignflag) {
                    campaignflag = JSON.parse(data[i].campaignflag);
                }
                if (typeof data[i].categoryTag[0] != "undefined" && data[i].categoryTag != "") {
                    categoryTagTitle = data[i].categoryTag[0].title;
                    for (var c = 0; c < data[i].categoryTag.length; c++) {
                        categoryTagId += data[i].categoryTag[c].id + " ";
                    }
                }
                if (typeof data[i].floorTag != "undefined" && data[i].floorTag != "") {
                    for (var c = 0; c < data[i].floorTag.length; c++) {
                        floorTagId += data[i].floorTag[c].id + " ";
                    }
                }

                // 要素を作成
                html +=
                    '<div class="news-list__entry' + ' ' + schedule + ' ' + campaignflag + ' ' + categoryTagId + ' ' + floorTagId + '">\n' +
                    '<div class="news-list__entry__inner">\n' +
                    '<div class="news-list__entry__flags">\n';
                if (campaignflag) {
                    html +=
                        '<div class="news-list__entry__flag is-benefit">\n' +
                        '<span>エムアイ<br>カード<br>特典</span>\n' +
                        '</div>\n';
                }
                if (remainingDay <= 1 && !remainingDay==="") {
                    html +=
                        '<div class="news-list__entry__flag is-end">\n' +
                        '<span>まもなく<br>終了</span>\n' +
                        '</div>\n';
                }
                html +=
                    '</div>\n' +
                    '<div class="news-list__entry__img">\n' +
                    '<img src="' + image + '" alt="' + navTitle + '">\n' +
                    '</div>\n' +
                    '<div class="news-list__entry__info">\n' +
                    '<div class="news-list__entry__tags">\n' +
                    '<span class="news-list__entry__tag is-category">' + categoryTagTitle + '</span>\n' +
                    '</div>\n' +
                    '<h4 class="news-list__entry__title">' + navTitle + '</h4>\n';
                if (dateFromF || dateToF) {
                    html += '<p class="news-list__entry__date">\n' + dateFromF + '〜' + dateToF + '</p>\n';
                }
                html += 
                    '</div>\n' +
                    '<a href="' + path + '" class="box-link"></a>\n' +
                    '</div>\n' +
                    '</div>\n';
            }

            // 日付をフォーマット
            function dateFormat(date) {
              	if (! date) {
                    return "";
                }
                date = date.replace(/-/g, '/'); // IE用
                date = new Date(date);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
                var weekday = weekdays[date.getDay()];
                var dateF = month + '月' + day + '日(' + weekday + ')';
                return dateF;
            }

            // 残りの日数を取得
            function getRemainingDay(date) {
                if (! date) {
                    return "";
                }
                date = date.replace(/-/g, '/'); // IE用
                var now = Date.now();
                var lastDay = new Date(date).getTime();
                var remainingDay = Math.floor((lastDay - now) / (1000 * 60 * 60 * 24));
                return remainingDay;
            }

            // 出力
            $('#newsListEntries').append(html);
        }
    });
})();

(function ($, document, window) {
    "use strict";
    window.APP = window.APP || {};
    window.APP.HOME = window.APP.HOME || {};
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
        (function categorySearch() {
            let $categorySearch = $('#categorySearch');
            let $form = $categorySearch.find('form');
            let action = $form.attr('action');
            let $items = $categorySearch.find('.category-search__items');
            let $item = $items.find('.category-search__item');
            $item.on('click', function () {
                let type = $(this).attr('data-type');
                let value = $(this).attr('data-value');
                action = action + 'shop_search/' + type + '.html#searchResult';
                $form.attr('action', action);
                $('#searchValue').val(value);
                $form.submit();
            });
        })();
        let pickupSliderFlag = false;

        function mainvisualSlider() {
            $('#mainvisualSlider').slick({
                arrows: true,
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                easing: 'easeInOutQuad',
                speed: 600,
                pauseOnHover: false,
                touchThreshold: 20,
            }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                $(this).find('.mainvisual__content').animate({
                    opacity: 0
                }, 400, 'easeOutCubic', function () {
                    $(this).css({
                        'margin-left': 20
                    });
                });
            }).on('afterChange', function (event, slick, currentSlide, nextSlide) {
                $(this).find('.mainvisual__content').animate({
                    'margin-left': 0,
                    opacity: 1
                }, 400, 'easeOutCubic');
            });
        }

        function pickupNewsSlider() {
          var $slider = $('#pickupNewsSlider');
          var initialSlide = 1;
          if($slider.find('.pickup-news__item').length < 3) {
            initialSlide = 0;
          }
          var slideOption = {
            arrows: true,
            dots: false,
            autoplay: true,
            autoplaySpeed: 5000,
            easing: 'easeInOutQuad',
            speed: 600,
            slidesToShow: 2,
            initialSlide: initialSlide,
            appendArrows: $('#pickupNews'),
            centerMode: true,
            touchThreshold: 20,
          };

          if($_GLOBAL.VAR.device < 3) {
            if(!pickupSliderFlag) {
              $slider.on('init', function(slick) {
                if($slider.find('.pickup-news__item').length < 3) {
                  $(this).find('.pickup-news__item').addClass('is-info-show');
                }
              })
              .on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                $(this).find('.pickup-news__item').addClass('is-info-hide');
              })
              .on('afterChange', function(event, slick, currentSlide, nextSlide) {
                $(this).find('.pickup-news__item').removeClass('is-info-hide');
              });

              $slider.slick(slideOption);
              pickupSliderFlag = true;
            }
          } else {
            if(pickupSliderFlag) {
              $slider.slick('unslick');
              pickupSliderFlag = false;
            }
          }

        }

        function topicsSlider() {
            $('#topicsSlider').slick({
                arrows: true,
                dots: false,
                autoplay: true,
                autoplaySpeed: 5000,
                easing: 'easeInOutQuad',
                speed: 600,
                slidesToShow: 3,
                slidesToScroll: 3,
                appendArrows: $('.topics-slider__inner'),
                touchThreshold: 20,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                }]
            });
        }

        function serviceSlider() {
            $('#serviceSlider').slick({
                arrows: true,
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                easing: 'easeInOutExpo',
                speed: 600,
                slidesToShow: 5,
                slidesToScroll: 5,
                appendArrows: $('.service-slider__inner'),
                touchThreshold: 20,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,
                    }
                }]
            });
        }
        (function newsListNavi() {
            let $newsList = $('#newsList');
            let $navi = $('#newsListNavi');
            let $targetBase, $target, tmpTarget;
            let newsListHeight, newsListTop, naviLeft, naviHeight, modalScrollTop;
            $(window).on('load resize scroll', function () {
                if (! $newsList.offset()) {
                    return;
                }
                newsListTop = $newsList.offset().top;
                newsListHeight = $newsList.outerHeight();
                naviHeight = $navi.outerHeight();
                if ($_GLOBAL.VAR.device > 2) {
                    $navi.find('.news-list__navi__items').addClass('js-easy-drawer__target');
                } else {
                    $navi.find('.news-list__navi__items').removeClass('js-easy-drawer__target');
                }
                newsListNaviChanged();
            });
        })();

        function newsListContent() {
            $('.news-list__entries').masonry({
                columnWidth: '.grid-sizer',
                itemSelector: '.news-list__entry',
                percentPosition: true,
                gutter: '.gutter-sizer'
            });
        }

        function hasTag(item, tags) {
            if (tags.length == 0) {
                return true;
            }
            for (var i = 0; i < tags.length; i++) {
                if ($(item).hasClass(tags[i])) {
                    return true;
                }
            }
            return false;
        }

        function fiterNewsList() {
            var newsListNavi = $('.news-list__navi__items');
            var newsListEntries = $('#newsListEntries');
            var newsList = newsListEntries.find('.news-list__entry');
            var input = $('input[type="checkbox"]:checked');
            var tag;
            var id;
            var categoryTag = [];
            var periodTag = [];
            var placeTag = [];
            var otherTag = [];
            var $newsListViewmore = $('#newsListViewmore');
            newsListEntries.masonry();
            newsList.hide();
            $(input).each(function () {
                tag = $(this).data('tag');
                id = $(this).attr('id').replace(/_\d+$/, "");
                if (id == "category") {
                    categoryTag = categoryTag.concat(tag);
                } else if (id == "period") {
                    periodTag = periodTag.concat(tag);
                } else if (id == "place") {
                    placeTag = placeTag.concat(tag);
                } else if (id == "other") {
                    otherTag = otherTag.concat(tag);
                }
            });
            if (newsListNavi.hasClass('is-fixed-end')) {
                newsListNavi.removeClass('is-fixed-end');
            }
            var i = 0;
            $(newsList).each(function () {
                var visible = hasTag(this, categoryTag)
                    && hasTag(this, periodTag)
                    && hasTag(this, placeTag)
                    && hasTag(this, otherTag);
                if (visible) {
                    $(this).removeClass('news-list__navi__items_hide');
                    if (++i <= 10) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else {
                    $(this).addClass('news-list__navi__items_hide').hide();
                }
            });
            if (i > 10) {
                $newsListViewmore.fadeIn(400);
                $newsListViewmore.next('.news-list__btn').fadeOut(400);
            } else {
                $newsListViewmore.fadeOut(400);
                $newsListViewmore.next('.news-list__btn').fadeIn(400);
            }
            newsListEntries.masonry();
        }

        function newsListNaviChanged() {
            $('.news-list__navi__items input[type=checkbox]').on('click', function() {
                fiterNewsList();
            });
        }

        (function newsListViewnore() {
            let $newsListNavi = $('#newsListNavi');
            let $newsListViewmore = $('#newsListViewmore');
            let $newsListEntries = $('#newsListEntries');
            $newsListViewmore.on('click', function () {
                if ($newsListNavi.hasClass('is-fixed-end')) {
                    $newsListNavi.removeClass('is-fixed-end');
                }
                var i = 0;
                $newsListEntries.find('.news-list__entry:hidden').each(function () {
                    if ($(this).hasClass('news-list__navi__items_hide')) {
                        return true;
                    }
                    if (++i <= 10) {
                        $(this).show();
                    }
                });
                if (i > 10) {
                    $(this).fadeIn(400);
                } else {
                    $(this).fadeOut(400);
                    $(this).next('.news-list__btn').fadeIn(400);
                }
                $newsListEntries.masonry();
            });
        })();

        (function newsList() {
            let $base = $('.news-list');
            let $navi = $base.find('.news-list__navi');
            let $content = $base.find('.news-list__content');

            $(window).on('load', function() {
                let naviHeight = $navi.height();
                $content.css({
                    'min-height': naviHeight
                });
            });
        })();

        $(window).on('load', function () {
            mainvisualSlider();
            pickupNewsSlider();
            newsListContent();
            topicsSlider();
            serviceSlider();
        });
        $(window).on('resize', function () {
            pickupNewsSlider();
        });
        $(window).on('load resize', function () {
            // console.log('----- load');
            $('.slick-slider').each(function () {
                let $img = $(this).find('img');
                let imgHeight = $img.eq(0).height();
                let $arrow = $(this).siblings('.slick-arrow');
                let arrowHeight = $arrow.eq(0).height();
                let arrowPosition = (imgHeight - arrowHeight) / 2;
                // console.log(arrowPosition);
                if ($(this).hasClass('topics-slider__items') && arrowPosition) {
                    $arrow.css({
                        'top': arrowPosition,
                        'bottom': 'auto'
                    });
                } else {
                    $arrow.css({
                        'top': 0,
                        'bottom': 0
                    });
                }
            });
        });
    })(window.APP, window.APP.HOME);
})(jQuery, document, this);