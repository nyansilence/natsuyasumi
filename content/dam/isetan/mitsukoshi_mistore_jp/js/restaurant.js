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
        let $base = $('.post-filter');
        let $box = $base.find('.post-filter__box');
        let $resetBtn = $('.post-filter__reset');
        let $postList = $('.post-list');
        let $items = $('.post-list__items');
        let $item = {};
        let defaultView = parseInt($postList.attr('data-default-view'));
        let $viewmore = $('.viewmore');
        let filterData = {
            genre: [],
            condition: [],
            place: []
        };
        var jsonPath = '';
        // path が"shops{_aaaa}.html"を含む場合にjson取得
        if (location.pathname.match(/.*\/shops\/restaurant_list_all.html/)) {
          jsonPath = location.pathname.replace(/\/shops\/restaurant_list_all.html/, "/restaurant_search/restaurants.json");
          console.log(jsonPath);
        }
        $.ajax({
            type: 'GET',
            url: jsonPath,
            dataType: 'json'
        }).done(function (data) {
            setList(data);
            filterList();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
        $resetBtn.on('click', function() {
            $box.find('input[type=checkbox]').prop('checked', false);
            filterData = {
                genre: [],
                condition: [],
                place: []
            };
            $(this).hide();
            filterList();
            return this;
        });
        $box.each(function() {
            let $checkbox = $(this).find('input[type=checkbox]');
            let key = '';
            if ($(this).hasClass('genre-filter')) {
                key = 'genre';
            } else if ($(this).hasClass('condition-filter')) {
                key = 'condition';
            } else if ($(this).hasClass('place-filter')) {
                key = 'place';
            }
            $(this).find('input[type=checkbox]').on('change', function() {
                filterData[key] = [];
                $checkbox.filter(':checked').each(function() {
                    var arrCond = $(this).val().split(',');
                    Array.prototype.push.apply(filterData[key], arrCond);
                });
                if (filterData.genre.length > 0 || filterData.condition.length > 0 || filterData.place.length > 0) {
                    $resetBtn.show();
                } else {
                    $resetBtn.hide();
                }
                filterList();
                return this;
            });
            return this;
        });
        $viewmore.on('click', function() {
            let count = 0;
            let show_items = [];
            $item.filter(':hidden').each(function() {
                if ($(this).hasClass('post-list__item_hide')) {
                    return true;
                }
                count++;
                if (count <= defaultView) {
                    show_items.push(this);
                }
            });
            $(show_items).fadeIn();
            if (count > defaultView) {
                $viewmore.show();
            } else {
                $viewmore.hide();
            }
            return this;
        });
        $(window).on('resize', function() {
            resetListMargin();
        });
        
        // ::::::::::::::::::::::::::::::::::::::::
        // FUNCTIONS
        // ::::::::::::::::::::::::::::::::::::::::
        function setList(data) {
            let html = '';
            for (var i in data) {
                try {
                    // JSONのデータを変数に格納
                    let image = data[i].image;
                    let url = data[i].path + ".html";
                    let floor = '';
                    let genre = '';
                    let genreIdArray = [];
                    let optionIdArray = [];
                    let floorIdArray = [];
                    for (var j in data[i].genreTag) {
                        genreIdArray.push(data[i].genreTag[j].id);
                    }
                    for (var j in data[i].optionTag) {
                        optionIdArray.push(data[i].optionTag[j].id);
                    }
                    for (var j in data[i].floorTag) {
                        floorIdArray.push(data[i].floorTag[j].id);
                    }
                    if (data[i].floorTag[0]) {
                        floor = data[i].floorTag[0].title;
                    }
                    if (data[i].genreTag[0]) {
                        genre = data[i].genreTag[0].title;
                    }
                    let category = '';
                    if (genre && floor) {
                        category = genre + ' | ' + floor;
                    } else if (genre) {
                        category = genre;
                    } else if (floor) {
                        category = floor;
                    }
                    // HTMLを作成
                    html += '<div class="post-list__item js-read-more__target" data-genre="' + genreIdArray + '" data-condition="' + optionIdArray + '" data-place="' + floorIdArray + '">' +
                        '<div class="post-list__img">' +
                        '<div class="post-list__bg-img" style="background-image: url(&quot;' + image + '&quot;);">' +
                        '<img src="' + image + '"' + 'alt="' + data[i].navTitle + '">' +
                        '</div>' +
                        '</div>' +
                        '<p class="post-list__category">' + category + '</p>' +
                        '<h4 class="post-list__title">' + data[i].navTitle + '</h4>' +
                        '<a href="' + url + '" class="box-link"></a>' +
                        '</div>';
                } catch (e) {
                    console.log(e);
                }
            }
            $items.append(html);
            $item = $('.post-list__item');
        }
        function hasCond(strData, arrCond) {
            if (arrCond.length == 0) {
                return true;
            }
            strData += ',';
            for (var i = 0; i < arrCond.length; i++) {
                let strCond = arrCond[i] + ',';
                if (strData.indexOf(strCond) > -1) {
                    return true;
                }
            }
            return false;
        }        
        function matchCond(strData, arrCond) {
            let matchFlg = false;
            if (arrCond.length == 0) {
                return true;
            }
            strData += ',';
            for (var i = 0; i < arrCond.length; i++) {
                let strCond = arrCond[i] + ',';
                if (strData.indexOf(strCond) > -1) {
                    matchFlg = true;
                }else{
                    return false;
                }
            }
            return matchFlg;
        }
        function filterList() {
            $items.css({opacity: 0});
            let count = 0;
            $item.each(function() {
                let match = hasCond($(this).attr('data-genre'), filterData.genre)
                    && matchCond($(this).attr('data-condition'), filterData.condition)
                    && hasCond($(this).attr('data-place'), filterData.place);
                if (match) {
                    count++;
                    $(this).removeClass('post-list__item_hide');
                    if (count <= defaultView) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else {
                    $(this).addClass('post-list__item_hide').hide();
                }
            });
            resetListMargin();
            if (count) {
                $postList.removeClass('has-no-items');
                $items.animate({opacity: 1}, 800);
            } else {
                $postList.addClass('has-no-items');
            }
            if (count > defaultView) {
                $viewmore.show();
            } else {
                $viewmore.hide();
            }
        }
        function resetListMargin() {
            let count = 0;
            let colNum = 3;
            let marginLeft = '2%';
            let marginRight = '2%';
            if ($_GLOBAL.VAR.device > 2) {
                colNum = 2;
                marginLeft = '4%';
                marginRight = '0';
            }
            $item.filter(':not(.post-list__item_hide)').each(function() {
                count++;
                if (count % 2 == 0) {
                    $(this).css('margin-left', marginLeft).css('margin-right', marginRight);
                } else {
                    $(this).css({'margin-left':'0', 'margin-right':'0'});
                }
                if (count == colNum) {
                    count = 0;
                }
            });
        }
    })(window.APP, window.APP.TEST);
})(jQuery, document, this);
