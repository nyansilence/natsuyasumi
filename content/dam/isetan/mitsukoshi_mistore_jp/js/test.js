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
      let $schedule = $eventCalender.find('.event-calender__schedule');
      let $trigger = $eventCalender.find('.event-calender__switch');
      let $select = $('#eventCalenderSelect');

      let thisDate, thisTime, thisYear, thisMonth, thisDay, thisWeek, nextDate, nextTime, setDate, startDate, startYear, startMonth, startDay, startWeek;
      let eventStart, eventEnd;
      let week = ['日', '月', '火', '水', '木', '金', '土'];
      let weekEndArray = [];
      let allDayArray = [];

      let setYear = $('#setDate').attr('data-set-year');
      let setMonth = $('#setDate').attr('data-set-month');
      let setDay = $('#setDate').attr('data-set-day');

      let period = 14;

      let setDateChange = function () {
        let changeDate;
        let $button = $('#setDateChange');

        $button.on('click', function() {
          changeDate = $('#setDateInput').val();
          $schedule.find('span').removeClass('is-active');
          $select.find('option').remove();
          $trigger.eq(0).trigger('click');
          console.log(changeDate);
          if(changeDate.match(/\d/)) {
            thisDate = new Date(setYear, setMonth - 1, changeDate);
            $date.html('');
            dateSet(setYear, setMonth, changeDate);
            ready();
            applicationEvent();
          }
        });
      }

      let dateSet = function(year, month, day) {
        thisDate = new Date(year, month - 1, day);
        thisTime = thisDate.getTime();

        thisYear = thisDate.getFullYear();
        thisMonth = thisDate.getMonth() + 1;
        thisDay = thisDate.getDate();
        thisWeek = thisDate.getDay();

        nextDate = new Date(thisDate.setDate(thisDay + 1));
        nextTime = nextDate.getTime();

        setDate = thisYear + '年' + thisMonth + '月' + thisDay + '日 (' + week[thisWeek] + ')';

        $('#setDate').text('日付設定：' + setDate);

        if(thisWeek >= 3) {
          startDate = new Date(thisDate.setDate(thisDay - (thisWeek - 3)));
        } else {
          startDate = new Date(thisDate.setDate(thisDay - (thisWeek + 4)));
        }
        startYear = startDate.getFullYear();
        startMonth = startDate.getMonth();
        startDay = startDate.getDate();
        startWeek = startDate.getDay();
      };

      let ready = function() {
        console.log(thisDate);
        // カレンダーの日付を出力
        for(let i=0; i<period; i++) {
          let todayClass = '';
          let loopDate, loopTime, loopYear, loopMonth, loopDay, loopWeek;
          loopDate = new Date(startYear, startMonth, startDay + i);
          loopTime = loopDate.getTime();
          loopYear = loopDate.getFullYear();
          loopMonth = loopDate.getMonth() + 1;
          loopDay = loopDate.getDate();
          loopWeek = loopDate.getDay();
          if(loopTime == thisTime) {
            todayClass = 'is-today';
          }
          if(loopWeek == 0 || loopWeek == 6) {
            weekEndArray.push(loopTime);
          }
          allDayArray.push(loopTime);
          $date.append('<span class="' + todayClass + '" data-this-date-time="' + loopTime + '">' + loopDay + '<br>(' + week[loopWeek]  + ')' + '</span>');
          $select.append('<option value="' + loopTime + '">' + loopYear + '年' + loopMonth + '月' + loopDay + '日(' + week[loopWeek] + ')</option>');
        }

        // console.log(thisDate);
        // console.log(setDate);
        // console.log(weekEndArray);
        // console.log(allDayArray);

      }

      let applicationEvent = function() {
        $item.each(function(index) {
          eventStart = $(this).attr('data-event-start');
          eventEnd = $(this).attr('data-event-end');

          let $eventSchedule = $schedule.eq(index);

          let span;

          for(let i=0; i<period; i++) {
            let thisDateTime = $date.find('span').eq(i).attr('data-this-date-time');

            span = '';

            if(thisDateTime >= eventStart && thisDateTime <= eventEnd) {
              span = '<span class="is-active" />';
            } else {
              span = '<span />'
            }
            $eventSchedule.append(span);
          }

          // console.log(eventStart, eventEnd);
        });
      };

      let setDateSwitch = function() {
        $trigger.on('click', function() {
          let type = $(this).attr('data-switch');

          $item.hide();
          $schedule.hide();

          $item.each(function(index) {
            let eventStart = $(this).attr('data-event-start');
            let eventEnd = $(this).attr('data-event-end');
            let comparingValue;

            // console.log(index);

            let eventSwitch = function() {
              if(comparingValue >= eventStart && comparingValue <= eventEnd) {
                $item.eq(index).show();
                $schedule.eq(index).show();
              }
            };

            if(type == 'all') {
              $item.show();
              $schedule.show();
            } else if(type == 'weekend') {
              for(let i=0; i<weekEndArray.length; i++) {
                comparingValue = weekEndArray[i];
                eventSwitch();
              }
            } else {
              if(type == 'today') comparingValue = thisTime;
              if(type == 'tomorrow') comparingValue = nextTime;
              eventSwitch();
            }

          });
          // console.log(type);
        });

        $select.on('change', function() {

          let comparingValue = $(this).find('option:selected').val();

          $item.hide();
          $schedule.hide();

          $item.each(function(index) {
            let eventStart = $(this).attr('data-event-start');
            let eventEnd = $(this).attr('data-event-end');
            // let comparingValue;

            // console.log(index);

            let eventSwitch = function() {
              if(comparingValue >= eventStart && comparingValue <= eventEnd) {
                $item.eq(index).show();
                $schedule.eq(index).show();
              }
            };

            eventSwitch();

          });

        });
      };


      dateSet(setYear, setMonth, setDay);
      ready();
      applicationEvent();
      setDateSwitch();
      setDateChange();

    })();



    $(window).on('load', function() {
    });

    $(window).on('resize', function() {
    });


  })(window.APP, window.APP.TEST);


})(jQuery, document, this);
