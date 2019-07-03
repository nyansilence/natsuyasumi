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

    (function eventCalender() {
      let $eventCalender = $('#eventCalender');
      let $date = $eventCalender.find('.event-calender__date');
      let $items = $eventCalender.find('.event-calender__items');
      let $item = $eventCalender.find('.event-calender__item');

      let $filter = $('.post-filter');
      let $select = $('.post-filter__select__date');
      let $resetBtn = $('.post-filter__reset');

      let today, todayTime, todayYear, todayMonth, todayDay, todayWeek, tomorrowDate, tomorrowTime, settedDate, startDate, startYear, startMonth, startDay, startWeek;
      let eventStart, eventEnd;
      let week = ['日', '月', '火', '水', '木', '金', '土'];
      let weekEndArray = [];

      let setYear, setMonth, setDay;
      let todayPos;

      let showItemIndexes = [];

      let period = 14;

      if(location.search) {
        setYear = (location.search.match(/y=(\d)/)) ? location.search.match(/y=(\d*)?/)[1] : NaN;
        setMonth = (location.search.match(/m=(\d)/)) ? location.search.match(/m=(\d*)?/)[1] : NaN;
        setDay = (location.search.match(/d=(\d)/)) ? location.search.match(/d=(\d*)?/)[1] : NaN;
        // console.log(setYear, setMonth, setDay);
      }


      // =====================
      // 日付の設定
      // =====================
      let dateSet = function(year, month, day) {
        // console.log(year, month, day);
        if(year && month && day) {
          today = new Date(year, month - 1, day);
        } else {
          today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
          // console.log(today);
        }
        todayTime = today.getTime();

        todayYear = today.getFullYear();
        todayMonth = today.getMonth();
        todayDay = today.getDate();
        todayWeek = today.getDay();

        tomorrowDate = new Date(today.setDate(todayDay + 1));
        tomorrowTime = tomorrowDate.getTime();

        settedDate = todayYear + '年' + (todayMonth + 1) + '月' + todayDay + '日 (' + week[todayWeek] + ')';

        if(todayWeek >= 3) {
          startDate = new Date(today.setDate(todayDay - (todayWeek - 3)));
        } else {
          startDate = new Date(today.setDate(todayDay - (todayWeek + 4)));
        }
        startYear = startDate.getFullYear();
        startMonth = startDate.getMonth();
        startDay = startDate.getDate();
        startWeek = startDate.getDay();

        // console.log(settedDate);
      };


      // =====================
      // イベント期間の設定:add
      // =====================
      let eventperiodSet = function() {
        let $eventPeriod = $('#eventPeriod').find('h2');
        let endDate = new Date(startYear, startMonth, startDay + period - 1 );
        $eventPeriod.html( (startMonth+1) + "月" + startDay + "日〜" + (endDate.getMonth()+1) + "月" + endDate.getDate() + "日のイベント");
      }

      // =====================
      // カレンダーの日付部分の表示
      // =====================
      let init = function() {

        // カレンダーの日付がすでにあれば削除
        if($date.find('.event-calender__date__col').length) {
          $date.find('.event-calender__date__col').remove();
        }

        // period分ループして、カレンダーの日付分と、日付を選択部分を出力
        for(let i=0; i<period; i++) {
          let loopDate = new Date(startYear, startMonth, startDay + i);
          let loopTime = loopDate.getTime();
          let loopYear = loopDate.getFullYear();
          let loopMonth = loopDate.getMonth();
          let loopDay = loopDate.getDate();
          let loopWeek = loopDate.getDay();

          $date.append('<div class="event-calender__date__col" data-this-date-time="' + loopTime + '"><strong>' + loopDay + '</strong><span>' + week[loopWeek]  + '</span></div>');
          $select.append('<option value="' + loopTime + '">' + (loopMonth + 1) + '月' + loopDay + '日' + '</option>');

          // 出力された日付に、曜日やTODAYのクラスをつける
          $date.each(function() {
            if(loopTime == todayTime) {
              $(this).find('.event-calender__date__col').eq(i).addClass('is-today');
            }
            if(loopWeek == 0) $(this).find('.event-calender__date__col').eq(i).addClass('is-sunday');
            if(loopWeek == 6) $(this).find('.event-calender__date__col').eq(i).addClass('is-saturday');
          });
          // console.log(loopTime, todayTime, loopTime - todayTime);

          // 後々利用するために、土日の日付データを配列に格納
          if(loopWeek == 0 || loopWeek == 6) {
            weekEndArray.push(loopTime);
          }
        }

        // console.log(today);
        // console.log(weekEndArray);

      }

      let reset = function() {
        $resetBtn.on('click', function() {

          $filter.find('.post-filter__button').each(function() {
            if($(this).hasClass('is-active')) $(this).trigger('click');
          });

          $filter.find('input[type=checkbox]').each(function() {
            if($(this).prop('checked')) {
              $(this).prop('checked', false).trigger('change');
            }
          });
          if(!$filter.find('select').find('option:first-child').prop('selected')) {
            $filter.find('select').find('option:first-child').prop('selected', true).trigger('change');
          }

        });
      };


      // =====================
      // スケジュール部分の出力
      // =====================
      let applicationEvent = function() {

        $item.find('.event-calender__schedule').html('');

        $item.each(function(index) {
          let href = $(this).find('.box-link').attr('href');
          eventStart = $(this).attr('data-event-start');
          eventEnd = $(this).attr('data-event-end');

          let $eventSchedule = $(this).find('.event-calender__schedule');
          let html;

          for(let i=0; i<period; i++) {
            let thisDateTime = $date.find('.event-calender__date__col').eq(i).attr('data-this-date-time');
            html = '';
            if(thisDateTime == todayTime) {
              html += '<span class="today">';
            } else if(thisDateTime == tomorrowTime) {
              html += '<span class="tomorrow">';
            } else {
              html += '<span>';
            }
            if(thisDateTime >= eventStart && thisDateTime <= eventEnd) {
              html += '<a href="' + href + '"></a>';
            }
            html += '</span>';
            $eventSchedule.append(html);
          }

        });
      };

      // =====================
      // イベントのフィルタリング
      // =====================
      let filtering = function() {
        let $filterSelect = $('.post-filter__select').find('select');
        let $filterBtn = $('.post-filter__button');
        let $filterCheckbox = $('.post-filter__checkbox');
        let isBtnClicked, isSelectChanged;
        let filterData = {
          date: 0,
          category: [],
          place: [],
          other: []
        };

        // =====================
        // カテゴリ、場所、その他チェック時
        // =====================
        $filterCheckbox.on('change', function() {
          let value = $(this).val().split(',');
          let $parents = $(this).parents('.post-filter__box');

	  for(let i=0; i<value.length; i++){
            if($parents.hasClass('category-filter')) {
              if(!$(this).prop('checked')) {
                filterData.category = filterData.category.filter(function(v){
                  return (v !== value[i]);
                });
              } else {
                filterData.category.push(value[i]);
              }
            }
            if($parents.hasClass('place-filter')) {
              if(!$(this).prop('checked')) {
                filterData.place = filterData.place.filter(function(v){
                  return (v !== value[i]);
                });
              } else {
                filterData.place.push(value[i]);
              }
            }
            if($parents.hasClass('other-filter')) {
              if(!$(this).prop('checked')) {
                filterData.other = filterData.other.filter(function(v){
                  return (v !== value[i]);
                });
              } else {
                filterData.other.push(value[i]);
              }
            }
	}

          eventFiltering();
        });

        // =====================
        // 日付セレクト選択時
        // =====================
        $filterSelect.on('change', function() {
          isSelectChanged = true;
          $filterSelect.parent('.post-filter__select').removeClass('is-active');
          if(!$(this).find('option:first-child').prop('selected')) {
            $filterBtn.removeClass('is-active');
            $filterSelect.parent('.post-filter__select').addClass('is-active');
          }
          if(!isBtnClicked) {
            filterData.date = $(this).find('option:selected').val();
            eventFiltering();
          }
          isSelectChanged = false;
        });

        // =====================
        // 日付ボタンクリック時
        // =====================
        $filterBtn.on('click', function() {
          isBtnClicked = true;

          weekEndArray = [];
          for(let i=0; i<period; i++) {
            let loopDate = new Date(startYear, startMonth, startDay + i);
            let loopTime = loopDate.getTime();
            let loopYear = loopDate.getFullYear();
            let loopMonth = loopDate.getMonth();
            let loopDay = loopDate.getDate();
            let loopWeek = loopDate.getDay();

            if(loopWeek == 0 || loopWeek == 6) {
              weekEndArray.push(loopTime);
            }
          }

          if(todayWeek == 0) {
            weekEndArray.splice(0,1);
          } else if(todayWeek == 1 || todayWeek == 2) {
            weekEndArray.splice(0,2);
          }

          $item.each(function() {
            $(this).find('.event-calender__schedule').find('span').removeClass('is-selected');
          });

          let type = $(this).attr('data-type');

          if(!$(this).hasClass('is-active')) {
            $filterBtn.removeClass('is-active');
            $(this).addClass('is-active');
            $filterSelect.find('option:first-child').prop('selected', 'selected').trigger('change');

            if(type == 'today') {
              filterData.date = todayTime;
            }
            if(type == 'tomorrow') {
              filterData.date = tomorrowTime;
            }
            if(type == 'weekend') {
              filterData.date = weekEndArray;
            }
            eventFiltering();

          } else {
            $filterBtn.removeClass('is-active');
            filterData.date = 0;
            eventFiltering();
          }

          isBtnClicked = false;
        });

        let eventFiltering = function() {
          // console.log('========== ' + new Date());

          let filteringByDate = [];
          let filteringByCategory = [];
          let filteringByPlace = [];
          let filteringByOther = [];

          if(filterData.date > 0 || filterData.date.length > 0 || filterData.category.length > 0 || filterData.place.length > 0 || filterData.other.length > 0) {
            $resetBtn.show();
          } else {
            $resetBtn.hide();
          }

          $item.each(function(index) {
            let eventStart = parseInt($(this).attr('data-event-start'));
            let eventEnd = parseInt($(this).attr('data-event-end'));
            let eventCategory = $(this).attr('data-category');
            let eventPlace = $(this).attr('data-place');
            let eventOther = $(this).attr('data-other');

            // =====================
            // 日付によるフィルタリング
            // =====================
            if(!$.isArray(filterData.date)) {
              if(filterData.date > 0) {
                if(filterData.date >= eventStart && filterData.date <= eventEnd) {
                  filteringByDate.push(index);
                }
              } else {
                filteringByDate.push(index);
              }
            } else {
              for(let i=0; i<filterData.date.length; i++) {
                if(filterData.date[i] >= eventStart && filterData.date[i] <= eventEnd) {
                  if($.inArray(index, filteringByDate) < 0) {
                    filteringByDate.push(index);
                  }
                }
              }
            }

            // =====================
            // カテゴリによるフィルタリング
            // =====================
            if(eventCategory.match(/\,/)) {
              let eventCategories = eventCategory.split(',');

              let duplication = eventCategories.filter(function (v, i, self) {
                if(filterData.category.indexOf(v) >= 0) {
                  return v;
                }
              });
              if(!duplication.length) {
                filteringByCategory.push(index);
              }
            } else {
              if($.inArray(eventCategory, filterData.category) < 0) {
                filteringByCategory.push(index);
              }
            }

            // =====================
            // 場所によるフィルタリング
            // =====================
            if(eventPlace.match(/\,/)) {
              let eventPlaces = eventPlace.split(',');

              let duplication = eventPlaces.filter(function (v, i, self) {
                if(filterData.place.indexOf(v) >= 0) {
                  return v;
                }
              });
              if(!duplication.length) {
                filteringByPlace.push(index);
              }
            } else {
              if($.inArray(eventPlace, filterData.place) < 0) {
                filteringByPlace.push(index);
              }
            }

            // =====================
            // その他によるフィルタリング
            // =====================
            if(eventOther.match(/\,/)) {
              let eventOhters = eventOther.split(',');

              let duplication = eventOhters.filter(function (v, i, self) {
                if(filterData.other.indexOf(v) >= 0) {
                  return v;
                }
              });
              if(!duplication.length) {
                filteringByOther.push(index);
              }
            } else {
              if($.inArray(eventOther, filterData.other) < 0) {
                filteringByOther.push(index);
              }
            }


          });

          // =====================
          // 日付、カテゴリ、場所、その他によるフィルタリング
          // =====================
          showItemIndexes = filteringByDate;

          if(filterData.category.length > 0) {
            // console.log(category.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByCategory) < 0);
            });
          }
          if(filterData.place.length > 0) {
            // console.log(category.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByPlace) < 0);
            });
          }
          if(filterData.other.length > 0) {
            // console.log(category.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByOther) < 0);
            });
          }

          // =====================
          // アイテム表示の切り替え
          // =====================
          $item.hide();
          for(var i=0; i<showItemIndexes.length; i++) {
            // console.log(showItemIndexes[i]);
            $item.eq(showItemIndexes[i]).stop().fadeIn(400);
          };

          if(!showItemIndexes.length) {
            $eventCalender.addClass('has-no-items');
          } else {
            $eventCalender.removeClass('has-no-items');
          }

          // 選択した日付のアクティブ化
          let selectedDateIndex = [];
          $item.each(function() {
            $(this).find('.event-calender__schedule').find('span').removeClass('is-selected');
          });

          // 週末ボタンが選択された場合
          if($.isArray(filterData.date)) {

            let activeWeekEnd = weekEndArray;

            for(let i=0; i<filterData.date.length; i++) {
              $date.eq(0).find('.event-calender__date__col').each(function(index) {
                let thisDateTime = $(this).attr('data-this-date-time');
                if(thisDateTime == filterData.date[i]) {
                  selectedDateIndex.push(index);
                }
              });
            }

          } else {

            $date.eq(0).find('.event-calender__date__col').each(function(index) {
              let thisDateTime = $(this).attr('data-this-date-time');
              if(thisDateTime == filterData.date) {
                selectedDateIndex.push(index);
              }
            });

          }

          for(let i=0; i<selectedDateIndex.length; i++) {
            $item.each(function() {
              $(this).find('.event-calender__schedule').find('span').eq(selectedDateIndex[i]).addClass('is-selected');
            });
          }

          // console.log('========== filtering');
          // console.log('date: ' + filteringByDate);
          // console.log('category: ' + filteringByCategory);
          // console.log('place: ' + filteringByPlace);
          // console.log('other: ' + filteringByOther);
          // console.log(showItemIndexes);
          // console.log(filterData);
        };
      }

      dateSet(setYear, setMonth, setDay);
      eventperiodSet();
      init();
      applicationEvent();
      filtering();

      reset();

    })();

    (function eventFilterAccordion() {
      let $accordionTarget = $('.post-filter__box__inner');

      $(window).on('load resize', function() {
        if($_GLOBAL.VAR.device < 3) {
          $accordionTarget.removeClass('js-easy-accordion__target');
        } else {
          $accordionTarget.addClass('js-easy-accordion__target');
        }
      });
    })();



    $(window).on('load', function() {
    });

    $(window).on('resize', function() {
    });


  })(window.APP, window.APP.TEST);


})(jQuery, document, this);
