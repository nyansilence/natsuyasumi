$(window).on('load', function () {
    'use strict';

    // URLパラメータを取得
    var urlParam = location.search.substring(1);
    if (!urlParam) return;
    var param = decodeURIComponent(urlParam).split('&');

    // パラメータを配列に格納
    var i;
    var paramArray = [];
    var nameArray = [];
    var valueArray = [];
    for (i in param) {
        paramArray[i] = param[i].split('=');
        nameArray[i] = paramArray[i][0];
        valueArray[i] = paramArray[i][1];
    }

    // フォームの状態を更新
    $('.custom-checkbox').prop('checked', false);
    var targetCategory = [];
    var targetGenre = [];
    var targetCondition = [];
    var targetPlace = [];
    for (i in paramArray) {
        var name = nameArray[i];
        var value = valueArray[i];
        var input = $('input[name="' + name + '"][value="' + value + '"]');
        input.prop('checked', true);

        // 対象を配列に格納
        var tag = input.data('tag');
        switch (name) {
            case 'category_search[]':
                targetCategory = targetCategory.concat(tag);
                break;
            case 'genre_search[]':
                targetGenre = targetGenre.concat(tag);
                break;
            case 'condition_search[]':
                targetCondition = targetCondition.concat(tag);
                break;
            case 'place_search[]':
                targetPlace = targetPlace.concat(tag);
                break;
            default:
                break;
        }
    }

    // JSONを選択
    var path = location.pathname;
    var jsonUrl;
    var page;
    if (path.match(/.*\/shop_?([a-zA-Z])*.html/)) {
        page = 'shop';
        jsonUrl = path.replace(/shop_?([a-zA-Z])*.html/, "/shop_search/shops.json");
    } else if (/.*\/restaurant_?([a-zA-Z])*.html/) {
        page = 'restaurant';
        jsonUrl = path.replace(/restaurant_?([a-zA-Z])*.html/, "/restaurant_search/restaurants.json");
    }


    // JSONを取得
    $.ajax({
        type: 'GET',
        url: jsonUrl,
        dataType: 'json',
        cache: false,
        success: function (data) {

            // 対象のデータを抽出
            if (page == 'shop') {
                data = data.filter(function (elem) { // カテゴリ
                    if (targetCategory[0] == 'all' || targetCategory.length === 0) {
                        return true;
                    } else {
                        for (var j in elem.categoryTag) {
                            if(targetCategory.indexOf(elem.categoryTag[j].id) >= 0){
                                return true;
                                break;
                            }
                        }
                    }
                });
            } else if (page == 'restaurant') {
                data = data.filter(function (elem) { // ジャンル
                    if (targetGenre[0] == 'all'|| targetGenre.length === 0) {
                        return true;
                    } else {
                        for (var j in elem.genreTag) {
                            if(targetGenre.indexOf(elem.genreTag[j].id) >= 0){
                                return true;
                                break;
                            }
                        }
                    }
                }).filter(function (elem) { // 条件
                    if (targetCondition[0] == 'all'|| targetCondition.length === 0) {
                        return true;
                    } else {
                        for (var j in elem.optionTag) {
                            if(targetCondition.indexOf(elem.optionTag[j].id) >= 0){
                                return true;
                                break;
                            }
                        }
                    }
                });
            }
            data = data.filter(function (elem) { // 場所
                if (targetPlace[0] == 'all'|| targetPlace.length === 0) {
                    return true;
                } else {
                    for (var j in elem.floorTag) {
                        if(targetPlace.indexOf(elem.floorTag[j].id) >= 0){
                            return true;
                            break;
                        }
                    }
                }
            });

            var html = '';
            var dataLength = data.length;

            // 親要素を作成
            if (page == 'shop') {
                html +=
                    '<div class="component page__block pb60 bg-gray">\n' +
                    '<div class="search-result search-result-shop" id="searchResult">\n' +
                    '<div class="search-result__inner ci-wrapper is-tb-delete">\n' +
                    '<div class="search-result__header">\n' +
                    '<p class="search-result__title">検索結果 ' + dataLength + '件</p>\n' +
                    '<p class="search-result__text">ショップ</p>\n' +
                    '</div>\n' +
                    '<div class="component shop-list">\n' +
                    '<div class="shop-list__inner">\n' +
                    '<div class="shop-list__items">\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div class="ci-btn ci-btn-fill ci-btn-center ci-btn-medium ci-btn-margin mt40">\n' +
                    '<a href="#page">条件を変えて検索する</a>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n';
            } else if (page == 'restaurant') {
                html +=
                    '<div class="component page__block pb60">\n' +
                    '<div class="search-result search-result-restaurant" id="searchResult">\n' +
                    '<div class="search-result__inner ci-wrapper is-tb-delete">\n' +
                    '<div class="search-result__header">\n' +
                    '<p class="search-result__title">検索結果 ' + dataLength + '件</p>\n' +
                    '<p class="search-result__text">レストラン&amp;カフェ</p>\n' +
                    '</div>\n' +
                    '<div class="component post-list is-column-3-2">\n' +
                    '<div class="post-list__inner">\n' +
                    '<div class="post-list__items">\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div class="ci-btn ci-btn-fill ci-btn-center ci-btn-medium mt40">\n' +
                    '<a href="#page">条件を変えて検索する</a>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n';
            }
            $('.footer-breadcrumb').before(html);

            // 出力先を設定
            var output;
            if (page == 'shop') {
                output = $('#searchResult').find('.shop-list__items');
            } else if (page == 'restaurant') {
                output = $('#searchResult').find('.post-list__items');
            }

            // コンテンツを作成
            html = '';
            for (var i in data) {
                var navTitle = data[i].navTitle;
                var path = data[i].path + ".html";
                var image = data[i].image;
                var text = data[i].text;
                if (page == 'shop') {
                    var categoryTagTitle = "";
                    if(data[i].categoryTag[0]){
                        categoryTagTitle = data[i].categoryTag[0].title;
                    }   
                    html +=
                        '<div class="shop-list__item">\n' +
                        '<div class="shop-list__img">\n' +
                        '<div class="shop-list__bg-img" style="background-image: url(&quot;' + image + '&quot;);">\n' +
                        '<img src="' + image + '" alt="' + navTitle + '">\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '<div class="shop-list__content">\n' +
                        '<p class="shop-list__title">' + navTitle + '</p>\n' +
                        '<p class="shop-list__category">' + categoryTagTitle + '</p>\n' +
                        '<p class="shop-list__text">' + text + '</p>\n' +
                        '</div>\n' +
                        '<a href="' + path + '" class="box-link"></a>\n' +
                        '</div>\n';
                } else if (page == 'restaurant') {
                    var genreTagTitle = "";
                    var floorTagTitle = "";
                    if(data[i].genreTag[0]){
                        genreTagTitle = data[i].genreTag[0].title;
                    }
                    if(data[i].floorTag[0]){
                        floorTagTitle = data[i].floorTag[0].title;
                    }
                    html +=
                        '<div class="post-list__item">\n' +
                        '<div class="post-list__img">\n' +
                        '<div class="post-list__bg-img" style="background-image: url(&quot;' + image + '&quot;);">\n' +
                        '<img src="' + image + '" alt="' + navTitle + '">\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '<p class="post-list__category">' + genreTagTitle + ' | ' + floorTagTitle + '</p>\n' +
                        '<h4 class="post-list__title">' + navTitle + '</h4>\n' +
                        '<a href="' + path + '" class="box-link"></a>\n' +
                        '</div>\n';
                }
            }

            // 出力
            output.append(html);
            restrictShopListText();
            // 検索結果まで移動
            $('html,body').scrollTop($('#searchResult').offset().top);
            scrollToAnker();
        }
    });
});

function scrollToAnker() {
    var $conf = {
        speed: 1200,
        easing: 'easeOutCubic'
    }
    $('a[href^="#"]').on('click', function () {
        var headerHeight = $('#globalHeader').outerHeight();
        var href = $(this).attr('href');
        var target = $(href == '#' || href == '' ? 'html' : href);
        var position = target.offset().top - headerHeight;
        $('html, body').stop().animate({
            scrollTop: position
        }, $conf.speed, $conf.easing);
        return false;
    });
}
function restrictShopListText() {
    let $shopListText = $('.shop-list__text');

    let textLimit = 80; // カットする文字数

    if ($shopListText.length) {
        $shopListText.each(function () {
            let text = $(this).text();
            let textLength = text.length;
            let remainingText = text.substr(0, textLimit);
            let trimingText = text.replace(remainingText, '');

            if (textLimit < textLength) {
                $(this).html('<span class="remaining-text">' + remainingText + '</span>' + '<span class="triming-text">' + trimingText + '</span>');
            }

        });
    }
};
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

        (function toggleCheckbox() {
            let $items = $('.search-index__items');

            $items.each(function () {
                let $checkbox = $(this).find('input[type=checkbox]');
                // if(!location.hash) {
                $checkbox.eq(0).prop('checked', true);
                // }

                $checkbox.each(function (index) {
                    $(this).on('click', function () {
                        if ($(this).prop('checked')) {
                            if ($(this).val() == 'all') {
                                $checkbox.prop('checked', false);
                                $checkbox.eq(0).prop('checked', true);
                            } else {
                                $checkbox.eq(0).prop('checked', false);
                            }
                        }
                    });
                });

                $('#resetBtn').on('click', function () {
                    $items.each(function () {
                        let $checkbox = $(this).find('input[type=checkbox]');
                        $checkbox.prop('checked', false);
                        $checkbox.eq(0).prop('checked', true);
                    });
                });
            });
        })();




    })(window.APP, window.APP.TEST);


})(jQuery, document, this);