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


    (function postFilter() {

      let $base = $('.post-filter');
      let $box = $base.find('.post-filter__box');
      let $resetBtn = $('.post-filter__reset');

      let $postList = $('.service-list');
      let $items = $('.service-list__items');
      let $item = $('.service-list__item');

      let defaultView = parseInt($postList.attr('data-default-view'));

      let $viewmore = $('.viewmore');

      let filterData = {
        service: [],
        category: [],
        other: []
      };

      let itemIndexes = [];
      let itemObjects = [];
      let showItemIndexes = [];
      let checkedData = [];

      $item.each(function(index) {
        itemIndexes.push(index);
        itemObjects.push($(this));
      });

      $box.each(function() {
        let $parent = $(this);
        let $checkbox = $(this).find('input[type=checkbox]');

        $checkbox.on('change', function() {
          let value = $(this).val();
          let target;

          if($parent.hasClass('service-filter')) target = filterData.service;
          if($parent.hasClass('category-filter')) target = filterData.category;
          if($parent.hasClass('other-filter')) target = filterData.other;

          if(!$(this).prop('checked')) {
            target.splice(target.indexOf(value), 1);
            checkedData.splice(checkedData.indexOf(value), 1);
          } else {
            target.push(value);
            checkedData.push(value);
          }

          filtering(filterData);

        });
      });

      let filtering = function(data) {
        let filteringByGenre = [];
        let filteringByCondition = [];
        let filteringByPlace = [];

        let service = data.service;
        let category = data.category;
        let other = data.other;

        if(service.length > 0 || category.length > 0 || other.length > 0) {
          $resetBtn.show();
        } else {
          $resetBtn.hide();
        }

        $item.each(function(index) {
          let thisService = $(this).attr('data-service');
          let thisCategory = $(this).attr('data-category');
          let thisOther = $(this).attr('data-other');


          // =====================
          // カテゴリによるフィルタリング
          // =====================
          if(thisService.match(/\,/)) {
            let services = thisService.split(',');

            let duplication = services.filter(function (v) {
              if(service.indexOf(v) >= 0) {
                return v;
              }
            });
            if(!duplication.length) {
              filteringByGenre.push(index);
            }
          } else {
            if($.inArray(thisService, service) < 0) {
              filteringByGenre.push(index);
            }
          }

          // =====================
          // カテゴリによるフィルタリング
          // =====================
          if(thisCategory.match(/\,/)) {
            let categorys = thisCategory.split(',');

            let duplication = categorys.filter(function (v) {
              if(category.indexOf(v) >= 0) {
                return v;
              }
            });
            if(!duplication.length) {
              filteringByCondition.push(index);
            }
          } else {
            if($.inArray(thisCategory, category) < 0) {
              filteringByCondition.push(index);
            }
          }

          // =====================
          // カテゴリによるフィルタリング
          // =====================
          if(thisOther.match(/\,/)) {
            let others = thisOther.split(',');

            let duplication = others.filter(function (v) {
              if(other.indexOf(v) >= 0) {
                return v;
              }
            });
            if(!duplication.length) {
              filteringByPlace.push(index);
            }
          } else {
            if($.inArray(thisOther, other) < 0) {
              filteringByPlace.push(index);
            }
          }

          showItemIndexes = itemIndexes;

          if(filterData.service.length > 0) {
            // console.log(service.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByGenre) < 0);
            });
          }
          if(filterData.category.length > 0) {
            // console.log(category.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByCondition) < 0);
            });
          }
          if(filterData.other.length > 0) {
            // console.log(other.length);
            showItemIndexes = showItemIndexes.filter(function(v){
              return ($.inArray(v, filteringByPlace) < 0);
            });
          }

        });

        if(!showItemIndexes.length) {
          $postList.addClass('has-no-items');
        } else {
          $postList.removeClass('has-no-items');
          $items.stop().css({
            opacity: 0
          });
        }

        $item.remove();
        // console.log(showItemIndexes);
        for(var i=0; i<showItemIndexes.length; i++) {

          if(i > defaultView - 1) {
            itemObjects[showItemIndexes[i]].css('display', 'none').appendTo($items);
          } else {
            itemObjects[showItemIndexes[i]].css('display', 'block').appendTo($items);
          }

          $items.animate({
            opacity: 1
          }, 800)
        }

        if(showItemIndexes.length <= defaultView) {
          $viewmore.hide();
        } else {
          $viewmore.show();
        }

        // console.log('===================');
        // console.log(filteringByGenre);
        // console.log(filteringByCondition);
        // console.log(filteringByPlace);
        // console.log(showItemIndexes);

      }

      let reset = function() {
        $resetBtn.on('click', function() {

          for(let i=0; i<checkedData.length; i++) {
            let value = checkedData[i];
            $('#filter_' + value).prop('checked', false);
          }

          filterData = {
            service: [],
            category: [],
            other: []
          };

          filtering(filterData);

        });
      };
      reset();

    })();


  })(window.APP, window.APP.TEST);


})(jQuery, document, this);
