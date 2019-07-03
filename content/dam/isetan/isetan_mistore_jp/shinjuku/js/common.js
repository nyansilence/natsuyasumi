(function($, document, window) {
  "use strict";
  window.APP = window.APP || {};
  window.APP.COMMON = window.APP.COMMON || {};

  (function($_GLOBAL, $_LOCAL) {

    // ::::::::::::::::::::::::::::::::::::::::
    // GLOBAL SETTING
    // ::::::::::::::::::::::::::::::::::::::::
    $_GLOBAL.FUNC.easyIntroAnimation = function(cb) {
      easyIntroAnimation(cb);
    }
    $_GLOBAL.ELEM.modal, $_GLOBAL.ELEM.modalCloseBtn;

    // ::::::::::::::::::::::::::::::::::::::::
    // LOCAL SETTING
    // ::::::::::::::::::::::::::::::::::::::::
    $_LOCAL = {};

    $_LOCAL.VAR = {
      isSpNaviOpen: false
    };


    // ::::::::::::::::::::::::::::::::::::::::
    // FUNCTIONS
    // ::::::::::::::::::::::::::::::::::::::::

    (function customForm() {
      let $customSelect = $('.custom-select');

      let selectOnChange = function() {
        $customSelect.each(function() {
          let $span = $(this).find('span');
          let $select = $(this).find('select');

          $select.on('change', function() {
            $span.text($(this).find('option:selected').text());
          });
        });
      }

      selectOnChange();
    })();

    (function slickSlide() {
      let $base = $('.js-slick-slide');

      $base.each(function() {
        let $slider = $(this).find('.js-slick-slide__slider');
        let $inner = ($(this).find('.js-slick-slide__inner').length) ? $(this).find('.js-slick-slide__inner') : $slider;
        let $img = ($(this).find('img').length) ? $(this).find('img') : false;

        let type = $(this).attr('data-slide-type');
        let slidesToShow = ($(this).attr('data-slides-to-show')) ? parseInt($(this).attr('data-slides-to-show')) : 1;
        let slidesToScroll = ($(this).attr('data-slides-to-scroll')) ? parseInt($(this).attr('data-slides-to-scroll')) : 1;

        let isSliderActive = false;
        let addOption;

        let slideOption = {
          arrows: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
          easing: 'easeInOutQuad',
          speed: 600,
          slidesToShow: slidesToShow,
          slidesToScroll: slidesToScroll,
          appendArrows: $inner,
          touchThreshold: 20
        };

        if(type ==  'tb-overflow') {
          addOption = {
            responsive: [
              {
                breakpoint: 768,
                settings: {
                  infinite: false,
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  variableWidth: true
                }
              }
            ]
          };
        }

        $.extend(slideOption, addOption);

        if(type == 'tb-unslick') {
          $(window).on('load resize', function() {
            if($_GLOBAL.VAR.device < 3) {
              if(!$slider.hasClass('slick-slider')) {
                $slider.slick(slideOption);
                isSliderActive = true;
              }
            } else {
              if($slider.hasClass('slick-slider')) {
                $slider.slick('unslick');
                isSliderActive = false;
              }
            }
            $slider.css('opacity', 1);
          });
        } else {
          $(window).on('load', function() {
            $slider.slick(slideOption);
            $slider.css('opacity', 1);
          });
        }

      });

      $(window).on('load resize', function() {
        // console.log('----- load');

        $('.slick-slider').each(function() {
          let $img = $(this).find('img');
          let imgHeight = $img.eq(0).height();
          let $arrow = $(this).siblings('.slick-arrow');
          let arrowHeight = $arrow.eq(0).height();

          let arrowPosition = (imgHeight - arrowHeight) / 2;

          // console.log(arrowPosition);

          if($(this).hasClass('js-slick-slide__slider') && arrowPosition) {
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


    })();

    (function fixedBgImage() {
      let $image = $('.fixed-bg-image');
      let targets = [];
      let breakPoints;

      let getValue = function() {
        breakPoints = [];
        if($image.length) {
          $image.each(function() {
            let classes = $(this).attr('class');
            let target = classes.match(/target\-(.*?)$/)[1];
            let offsetTop = $('.' + target).offset().top;

            breakPoints.push(offsetTop);
          });
        }
      }
      $(window).on('load resize scroll', function() {
        getValue();
        for(let i=0; i<breakPoints.length; i++) {
          if($_GLOBAL.VAR.scrollBottom > breakPoints[i] - 200) {
            $image.eq(i).show();
          } else {
            $image.eq(i).hide();
          }
        }
      });
    })();

    (function globalHeader() {
      let $pageHeader = $('#pageHeader');
      let $globalHeader = $('#globalHeader');

      let globalHeaderHeight = $globalHeader.outerHeight();
      let scrollTop = $(window).scrollTop();
      let tmpScrollTop = 0;
      let height = $globalHeader.outerHeight();

      $(window).on('load resize scroll', function() {
        if(!$_LOCAL.VAR.isSpNaviOpen) {

          if($_GLOBAL.VAR.scrollTop > globalHeaderHeight - 25) {
            $globalHeader.addClass('is-fixed');
            $pageHeader.addClass('is-fixed').css({
              'padding-top': height
            });

            scrollTop = $(window).scrollTop();
            if($_GLOBAL.VAR.scrollTop > $('#pageContent').offset().top) {
              $globalHeader.addClass('is-ready');
              if($_GLOBAL.VAR.device < 2) {
                $globalHeader.css('transform', 'translateY(0)');
                if (scrollTop >= tmpScrollTop) {
                  $globalHeader.css('transform', '');
                }
              } else {
                $globalHeader.css('transform', 'translateY(0)');
              }
            } else {
              $globalHeader.css('transform', '');
            }
            // console.log(tmpScrollTop, scrollTop);
            tmpScrollTop = scrollTop;

          } else {
            $globalHeader.removeClass('is-ready is-fixed');
            $pageHeader.removeClass('is-fixed').css({
              'padding-top': ''
            });
          }

        }
      });

    })();


    (function spNavi() {
      let $trigger = $('#spNaviTrigger');
      let $spNavi = $('#spNavi');
      let $close = $('#spNaviClose');
      let $shopListTrigger = $('#spShopListTrigger');
      let $spShopList = $('#spShopList');
      let $back = $('#spNaviShoplistBack');
      let $globalHeader = $('#globalHeader');

      let spNaviHeight = $spNavi.outerHeight();
      let spNaviScrollTop = 0;

      $trigger.on('click', function() {
        if(!$_LOCAL.VAR.isSpNaviOpen) {
          $_LOCAL.VAR.isSpNaviOpen = true;

          $(this).addClass('is-active');
          $globalHeader.addClass('is-active');
          spNaviScrollTop = $(window).scrollTop();
          $spNavi.css({
            transform: 'translateX(0)'
          });


          $('body').css({
            position: 'fixed',
            'overflow-y': 'scroll',
            top: -spNaviScrollTop
          });
        } else {
          $_LOCAL.VAR.isSpNaviOpen = false;

          $trigger.removeClass('is-active');
          $spNavi.css({
            transform: ''
          });
          $globalHeader.removeClass('is-active');

          $('body').css({
            position: '',
            'overflow-y': '',
            top: ''
          });


          $(window).scrollTop(spNaviScrollTop);
          event.stopPropagation();
          return false;
        }
      });

      $shopListTrigger.on('click', function() {
        $spShopList.css({
          transform: 'translateX(0)'
        });
      });

      $back.on('click', function() {
        $spShopList.css({
          transform: ''
        });
      });

    })();

    (function subNaviSearch() {
      let $subNavi = $('#subNavi');
      let $trigger = $subNavi.find('.type-search span');

      $trigger.on('click', function() {
        $(this).next('label').animate({
          width: 200
        }, 400, 'easeOutCubic');
      });
    })();

    (function subNavShoplist() {
      let $subNavi = $('#subNavi');
      let $trigger = $subNavi.find('.type-shop-list');
      let $shopList = $('#subNavShoplist');

      let triggerRight;

      let setPosition = function() {
        if($subNavi.length > 0) {
          if($(window).width() > $_GLOBAL.VAR.PC_WIDTH) {
            triggerRight = $trigger.offset().left - $subNavi.offset().left + $trigger.outerWidth() - 180;
            $shopList.css({
              left: triggerRight
            });
          }
        }
      };

      let mouseHoverEvent = function() {
        $trigger.on('mouseenter', function() {
          if($_GLOBAL.VAR.device < 2) {
            setPosition();
            $subNavi.find('.sub-navi__item').removeClass('is-active');
            $('.sub-navi__target').stop().slideUp(400);
            $shopList.stop().slideDown(400);
            $trigger.addClass('is-active');
          }
        });

        $shopList.on('mouseleave', function() {
          if($_GLOBAL.VAR.device < 2) {
            $shopList.stop().slideUp(400);
            $trigger.removeClass('is-active');
          }
        });
      };

      let clickEvent = function() {
        $trigger.on('click', function() {
          // console.log('click');
          if($(this).hasClass('is-active')) {
            $subNavi.find('.sub-navi__item').removeClass('is-active');
            $('.sub-navi__target').stop().slideUp(400);
          } else {
            $shopList.stop().slideDown(400);
            $trigger.addClass('is-active');
          }
        });
      };

      mouseHoverEvent();
      clickEvent();
      $(window).on('load resize', function() {
        setPosition();
      });
    })();

    (function subNaviLanguage() {
      let $subNavi = $('#subNavi');
      let $trigger = $subNavi.find('.type-language');
      let $subNaviLanguage = $('#subNaviLanguage');

      let triggerRight;

      let runEvent;

      let setPosition = function() {
        if($subNavi.length > 0) {
          if($(window).width() > $_GLOBAL.VAR.PC_WIDTH) {
            runEvent = 'mouseenter';
            triggerRight = $trigger.offset().left - $subNavi.offset().left + $trigger.outerWidth() - 75;
            $subNaviLanguage.css({
              left: triggerRight
            });
          } else {
            runEvent = 'click';
            $subNaviLanguage.css({
              left: '',
              right: '4%'
            });
          }
        }
      }

      let mouseHoverEvent = function() {
        $trigger.on('mouseenter', function() {
          if($_GLOBAL.VAR.device < 2) {
            setPosition();
            $subNavi.find('.sub-navi__item').removeClass('is-active');
            $('.sub-navi__target').stop().slideUp(400);
            $subNaviLanguage.stop().slideDown(400);
            $trigger.addClass('is-active');
          }
        });

        $subNaviLanguage.on('mouseleave', function() {
          if($_GLOBAL.VAR.device < 2) {
            $subNaviLanguage.stop().slideUp(400);
            $trigger.removeClass('is-active');
          }
        });
      };

      let clickEvent = function() {
        $trigger.on('click', function() {
          // console.log('click');
          if($(this).hasClass('is-active')) {
            $subNavi.find('.sub-navi__item').removeClass('is-active');
            $('.sub-navi__target').stop().slideUp(400);
          } else {
            $subNaviLanguage.stop().slideDown(400);
            $trigger.addClass('is-active');
          }
        });
      };

      mouseHoverEvent();
      clickEvent();
      $(window).on('load resize', function() {
        setPosition();
      });
    })();

    (function footerSns() {
      let $footerSns = $('#footerSns');
      let $trigger = $footerSns.find('.footer-sns__trigger');
      let $target = $footerSns.find('.footer-sns__target');
      let $close = $footerSns.find('.footer-sns__close');

      let isTargetOpen = false;
      let thisType, nowType;

      $trigger.on('click', function() {
        let type;

        $trigger.removeClass('is-active');

        if($(this).hasClass('has-target')) {
          type = $(this).attr('data-type');
          $(this).addClass('is-active');
        }

        $target.each(function() {
          thisType = $(this).attr('data-type');
          nowType = thisType;

          $(this).hide();

          if(type == thisType) {
            $(this).fadeIn(400, 'easeOutCubic');
          }

        });

      });

      $close.on('click', function() {
        $trigger.removeClass('is-active');
        $target.slideUp();
      });

    })();


    (function backToTop() {
      let $target = $('#backToTop');


      var scroll_top = $(window).scrollTop();
      var tmp_scroll_top = 0;
      $(window).on('scroll', function() {
        if($target.length) {
          // if($_GLOBAL.VAR.scrollTop > 300) {
          //   $target.fadeIn(400, 'easeOutCubic');
          // } else {
          //   $target.fadeOut(400, 'easeOutCubic');
          // }
          scroll_top = $(window).scrollTop();
          if(scroll_top > $('#pageContent').offset().top) {
            $target.css({
              transform: 'translateY(200%)',
              opacity: 0
            });
            if (scroll_top <= tmp_scroll_top) {
              $target.css({
                transform: 'translateY(0)',
                opacity: 1
              });
            }
          } else {
            $target.css({
              transform: 'translateY(200%)',
              opacity: 0
            });
          }
          tmp_scroll_top = scroll_top;
        }
      });

    })();

    (function jsScrollAddClass() {
      var scrollBottom, fadeInPoint;
      $(window).on('load scroll resize', function() {
        scrollBottom = $(window).scrollTop() + $(window).height();
        fadeInPoint = scrollBottom - ($(window).height() * .25);

        // console.log(scrollBottom, fadeInPoint);

        $('.js-scroll-add-class').each(function() {
          // console.log($(this).offset().top);
          if($(this).offset().top < fadeInPoint) {
            $(this).addClass('is-animated');
          }
        });
      });
    })();

    (function jsEasyTab() {
      var $triggers = $('.js-easy-tab__triggers');

      $triggers.each(function() {
        var $trigger = $(this).find('.js-easy-tab__trigger');
        var $targets = $(this).next('.js-easy-tab__targets');
        var $target = $targets.find('.js-easy-tab__target');

        $trigger.on('click', function() {
          var index = $(this).index();

          $trigger.removeClass('is-active');
          $(this).addClass('is-active');

          $target.hide();
          $target.eq(index).show();
        });
      });

    })();

    (function easyDrawer() {
      $('#page').append('<div class="drawer" id="drawer"><div class="drawer__content"><div class="drawer__close"/></div></div>');

      // ==========
      // 設定
      // ==========
      var boxElem = '.js-easy-drawer';
      var triggerElem = '.js-easy-drawer__trigger';
      var targetBaseElem = '.js-easy-drawer__target-base';
      var targetElem = '.js-easy-drawer__target';
      var closeBtnElem = '.drawer__close';
      var drawerBaseElem = '#drawer';
      var drawerContentElem = '.drawer__content';

      var fadeDuration = 400;
      var fadeEasing = 'swing';

      var drawerScrollTop = 0;
      var isDrawerOn = false;

      // ==========
      // 処理
      // ==========
      var $drawer = $(drawerBaseElem);
      var $drawerContent = $drawer.find(drawerContentElem);
      var $closeBtn = $drawer.find(closeBtnElem);

      var $box = $(boxElem);
      var $trigger = $(boxElem).find(triggerElem);
      var $targetBase, $target;

      $trigger.on('click', function() {
        $targetBase = $(this).next(targetBaseElem);
        $target = $targetBase.find(targetElem);

        if($target.length) {
          if(!isDrawerOn) {
            isDrawerOn = true;
            drawerScrollTop = $(window).scrollTop();
            // --　クリックしたときの処理
            $target.remove();
            $drawerContent.append($target);
            $drawer.fadeIn(100, function() {
              $drawerContent.animate({
                'margin-left': 0
              }, fadeDuration, fadeEasing);
            });
            $drawer.scrollTop(0);
            // -- クリックしたときの処理

            $('body').css({
              position: 'fixed',
              'overflow-y': 'scroll',
              top: -drawerScrollTop
            });
          }
        }

      });

      $closeBtn.on('click', function() {
        // -- 閉じるボタンをクリックしたときの処理
        // $drawerContent.css('transform', '');
        $drawerContent.animate({
          'margin-left': '-105%'
        }, fadeDuration, fadeEasing, function() {
          $drawer.fadeOut(100);
          $drawer.find(targetElem).remove();
          $targetBase.append($target);
          isDrawerOn = false;
        });
        // $drawer.fadeOut(fadeDuration, fadeEasing, function() {
        // });
        // -- 閉じるボタンをクリックしたときの処理

        $('body').css({
          position: '',
          'overflow-y': '',
          top: ''
        });
        $(window).scrollTop(drawerScrollTop);
        event.stopPropagation();
        return false;
      });

    })();

    // - imgをbackground-imageに変更
    // ========================================
    (function imgToBgimg(className) {
      if(!className) {
        className = '_bg-img';
      }
      $('[class*=' + className + ']').each(function() {
        var img = $(this).find('img');
        var pcImgSrc = img.eq(0).attr('src');
        var spImgSrc = img.eq(1).attr('src');

        // console.log(pcImgSrc, spImgSrc);

        if(pcImgSrc) {
          $(this).css({
            'background-image': 'url(' + pcImgSrc + ')'
          });
          if(spImgSrc) {
            $(this).addClass('has-sp-img');
          }
        }
      });
    })('__bg-img');


    (function easyModal() {
      let easing = 'easeOutCubic';
      let duration = 400;

      // ========================
      // モーダルの準備
      // ========================
      let $modal, $modalContent, $modalClose, $modalPrev, $modalNext;

      $('body').append('<div class="modal" id="modal"><div class="modal__content"><div class="modal__close" /></div><div class="modal__arrow"><div class="modal__prev"/><div class="modal__next"/></div></div>');
      $modal = $('#modal');
      $modalContent = $modal.find('.modal__content');
      $modalClose = $modal.find('.modal__close');
      $modalPrev = $modal.find('.modal__prev');
      $modalNext = $modal.find('.modal__next');
      let $modalBottomClose = $('.modal__bottom-close');


      // ========================
      // トリガークリックでモーダルを展開
      // ========================
      let $box, $trigger, $targetBase, $target, $cloneTarget;
      let targetDatas = [];
      let triggerDatas = [];
      let targetData = [];
      let triggerData = [];
      let targets = [];
      let targetIndex, activeIndex, modalScrollTop, modalType;
      let isCloneFlag = false;
      let isModalOn = false;
      let isMouseDown = false;
      let dragStart, dragEnd, dragDiff, moveValue;

      $box = $('.js-easy-modal');
      $trigger = $box.find('.js-easy-modal__trigger');

      $box.each(function() {
        targetData = $(this).find('.js-easy-modal__target').map(function() {
          return $(this);
        });
        triggerData = $(this).find('.js-easy-modal__trigger').map(function() {
          return $(this);
        });
        targetDatas.push(targetData);
        triggerDatas.push(triggerData);
      });
      // console.log(targetDatas, triggerDatas);

      for(let i=0; i<triggerDatas.length; i++) {
        // console.log(i);
        let triggers = triggerDatas[i];

        for(let j=0; j<triggers.length; j++) {
          let trigger = triggers[j];

          trigger.on('click', function() {
            targets = targetDatas[i];
            $target = targetDatas[i][j];
            modalType = $box.eq(i).attr('data-modal-type');
            isCloneFlag = ($target.parent('.js-easy-modal__target-base').length) ? false : true;
            targetIndex = activeIndex = j;

            if(modalType) {
              if(targets.length < 2) {
                $modal.removeClass('type-slide');
              } else {
                $modal.addClass('type-' + modalType);
              }
            }

            if(!isModalOn) {
              isModalOn = true;
              modalScrollTop = $(window).scrollTop();

              if(!isCloneFlag) {
                $targetBase = $target.parent('.js-easy-modal__target-base');
                $target.remove();
              }
              $cloneTarget = $target.clone(false, false);
              $modalContent.prepend($cloneTarget);
              $modal.fadeIn(duration, easing, function() {
                $(this).css('display', 'flex');
              });
              $modal.scrollTop(0);

              $('body').css({
                position: 'fixed',
                'overflow-y': 'scroll',
                top: -modalScrollTop
              });
            }

          });
        }
      }

      // ========================
      // 閉じるボタンクリックでモーダルを閉じる
      // ========================
      $modalClose.on('click', function() {
        // -- 閉じるボタンをクリックしたときの処理
        $modal.fadeOut(duration, easing, function() {
          $modal.find('.js-easy-modal__target').remove();
          if(!isCloneFlag) {
            $targetBase.append($cloneTarget);
            targets[activeIndex] = $cloneTarget;
          }
          $modal.removeClass(function(index, className) {
            return (className.match(/\btype-\S+/g) || []).join(' ');
          });
          isModalOn = false;
        });
        // -- 閉じるボタンをクリックしたときの処理

        $('body').css({
          position: '',
          'overflow-y': '',
          top: ''
        });
        $(window).scrollTop(modalScrollTop);
        event.stopPropagation();
        return false;
      });

      $(document).on('click touchend', '.modal__bottom-close', function() {
        $modalClose.trigger('click');
        event.stopPropagation();
        return false;
      });

      // ========================
      // モーダルをスライドさせる
      // ========================
      let slideToPrevModal = function() {
        if(targets.length > 2) {
          if(activeIndex == 0) {
            activeIndex = targets.length - 1;
          } else {
            activeIndex -= 1;
          }

          $('#modal').find('.js-easy-modal__target').animate({
            opacity: 0,
            left: 100
          }, duration, easing, function() {
            $(this).html(targets[activeIndex].clone(false, false).html());
            $(this).css({
              left: -100
            });
            $(this).animate({
              opacity: 1,
              left: 0
            }, duration, easing, function() {
            });
          });
        }
      }
      let slideToNextModal = function() {
        if(targets.length > 2) {
          if(activeIndex >= targets.length - 1) {
            activeIndex = 0;
          } else {
            activeIndex += 1;
          }

          $('#modal').find('.js-easy-modal__target').animate({
            opacity: 0,
            left: -100
          }, duration, easing, function() {
            $(this).html(targets[activeIndex].clone(false, false).html());
            $(this).css({
              left: 100
            });
            $(this).animate({
              opacity: 1,
              left: 0
            }, duration, easing, function() {
            });
          });
        }
      }

      $modalPrev.on('click', function() {
        slideToPrevModal();
      });
      $modalNext.on('click', function() {
        slideToNextModal();
      });

      $(document).on($_GLOBAL.HANDLER.mousedown, '#modal .js-easy-modal__target', function(e) {
        // console.log(e.clientX);
        if($_GLOBAL.IDENTIFIER.isTouchDevice) {
          dragStart = e.originalEvent.changedTouches[0].pageX;
        } else {
          dragStart = e.clientX;
        }
      });

      $(document).on($_GLOBAL.HANDLER.mouseup, '#modal .js-easy-modal__target', function(e) {
        // console.log(e.clientX);
        if($_GLOBAL.IDENTIFIER.isTouchDevice) {
          dragEnd = e.originalEvent.changedTouches[0].pageX;
        } else {
          dragEnd = e.clientX;
        }
        dragDiff = dragEnd - dragStart;

        if(modalType == 'slide') {
          if(Math.abs(dragDiff) > 50) {

            if(dragDiff < 0) {
              $modalNext.trigger('click');
            } else {
              $modalPrev.trigger('click');
            }
          }
        }

      });

    })();

    (function irreversibleAccordion() {
      // ==========
      // 設定
      // ==========
      var baseElem = '#base';
      var boxElem = '.js-ir-accordion';
      var triggerElem = '.js-ir-accordion__trigger';
      var targetElem = '.js-ir-accordion__target'

      var slideDuration = 400;
      var slideEasing = 'swing';

      // ==========
      // 処理
      // ==========
      $(baseElem).find(boxElem).each(function(index) {
        var $box = $(this);
        var $trigger = $(this).find(triggerElem);
        var $target = $(this).find(targetElem);

        $trigger.on('click', function() {
          $trigger.remove();
          $box.addClass('is-open');
          $target.slideDown(400);
        });
      });
    })();

    (function easyAccordion() {
      // ==========
      // 設定
      // ==========
      var baseElem = '#page';
      var boxElem = '.js-easy-accordion';
      var triggerElem = '.js-easy-accordion__trigger';
      var targetElem = '.js-easy-accordion__target';

      var slideDuration = 400;
      var slideEasing = 'swing';

      // ==========
      // 処理
      // ==========
      $(baseElem).find(boxElem).each(function(index) {
        // 使い回しできるようにDOMを変数に代入
        var $box = $(this);
        var $trigger = $(this).find(triggerElem);
        var $target;

        var baseText, changedText, baseHtml, changedHtml;

        $box.each(function(index) {
          if($(this).find(triggerElem).hasClass('is-open')) {
            $(this).find(targetElem).show();
          }
        });

        // トリガーがクリックされたら
        $trigger.on('click', function() {

          $target = $box.find(targetElem);

          if(!baseText) {
            baseText = $(this).text();
            baseHtml = $(this).html();
          }
          changedText = $(this).attr('data-toggle-text');
          changedHtml = baseHtml.replace(baseText, changedText);

          // console.log(baseText, changedText);
          // console.log(baseHtml, changedHtml);


          // 一度に開くアイテムを一つに制限する場合は以下をONに
          // if(!$(this).hasClass('is-active')) {
          //   $(triggerElem).removeClass('is-active');
          //   $(targetElem).stop().slideUp(slideDuration, slideEasing);
          // }

          // 対象となるアイテムにのみ、アクションを起こす
          if(!$trigger.hasClass('is-open')) {
            if(changedText) {
              console.log('true');
              $trigger.html(changedHtml);
            }
            $trigger.addClass('is-open');
            $target.stop().slideDown(slideDuration, slideEasing);
          } else {
            if(changedText) {
              $trigger.html(baseHtml);
            }
            $trigger.removeClass('is-open');
            $target.stop().slideUp(slideDuration, slideEasing);
          }

        });

        $(window).on('resize', function() {
          if($_GLOBAL.FLAG.isBreakpointSwitched) {
            $trigger.removeClass('is-open');
            $(targetElem).css('display', '');
          }
        });

      });

    })();

    (function jsReadMore() {
      let $box = $('.js-read-more');

      $box.each(function() {
        let defaultView = parseInt($(this).attr('data-default-view'));

        let $trigger = $(this).find('.js-read-more__trigger');
        let $target = $(this).find('.js-read-more__target');


        let init = function() {
          for(let i=0; i<$target.length; i++) {
            if(i > defaultView - 1) {
              $target.eq(i).hide();
            }
          }

          if($target.length <= defaultView) {
            $trigger.hide();
          }
        }

        if($(this).hasClass('js-slick-slide') && $(this).attr('data-slide-type') == 'tb-unslick') {
          if($_GLOBAL.VAR.device > 2) {
            init();
          }
        } else {
          init();
        }

        $trigger.on('click', function() {
          // console.log('click');
          $target.fadeIn(400);
          $(this).fadeOut(400);
        });
      });
    })();

    // イントロアニメーション（ローディング画面）の追加
    // - 第一引数: イントロ終了後に実行する関数
    // ========================================
    function easyIntroAnimation(cb) {

      // 設定
      // --------------------

      // 操作するDOMの設定
      var baseElem = '#global';
      var introBaseElem = '#introAnimation';
      var loadingBarElem = '.intro-animation__bar';

      var fadeOutDuration = 800;
      var fadeOutEasing = 'linear';
      var fadeOutDelay = 500;

      var isPageLoaded = false;
      var isAnimationEnd = false;
      var isIntroEnd = false;
      var timer = false;
      var imgLength = 0;
      var loadCount = 0;
      var progressRate = 0;

      var $base = $(baseElem);
      var $introBase = $base.find(introBaseElem);
      var $loadingBar = $(loadingBarElem);

      // 初回アクセス時のイベント登録
      var firstAccessEvent = function() {
        timer = setInterval(function() {
          progressRate = (loadCount / imgLength) * 100;
          $loadingBar.css({
            'width': progressRate + '%'
          });
          if(progressRate === 100 || isPageLoaded === 'error' || imgLength <= 0) {
            isAnimationEnd = true;
            introEndEvent();
          }
        }, 50);
      };

      // 二回目以降のイベント登録
      var haveAccessedEvent = function() {
        firstAccessEvent();
      };

      // イントロ終了時のイベント登録
      var introEndEvent = function() {
        if(isAnimationEnd) {
          isIntroEnd = true;
          clearInterval(timer);
          $introBase.delay(fadeOutDelay).fadeOut(fadeOutDuration, fadeOutEasing, function() {
            // イントロ終了時に必ずページのスクロール禁止を解除すること
            $('body').css({
              position: '',
              'overflow-y': ''
            });
          });
          isPageLoaded = true;
          if(cb) {
            cb();
          }
        }
      };

      var $base;

      // 処理
      // --------------------

      if($introBase.length) {

        // イントロ用のDOMが存在するとき

        // ページのスクロールを禁止
        $('body').css({
          position: 'fixed',
          'overflow-y': 'scroll'
        });

        // ページ内の画像枚数を取得
        imgLength = $base.find('img').length;

        // 画像が読まれるたび、カウントを増やす
        $base.find('img').each(function() {
          var src = $(this).attr('src');
          $('<img>').attr('src', src).on('error', function() {
            isPageLoaded = 'error';
          }).on('load', function() {
            loadCount++;
          });
        });

        if(!$.cookie('access')){
          // 初回のアクセスだったら、初回アクセス用の処理を実行
          firstAccessEvent();
          $.cookie('access', 'accessed', {
            expires: 7,
            path: '/'
          });
          // 二回目以降なら、二回目以降用の処理を実行
        } else {
          haveAccessedEvent();
          // console.log($.cookie('access'));
        }
      } else {
        // イントロ用のDOMが存在しないときは、即座に終了イベントを実行
        isAnimationEnd = true;
        introEndEvent();
      }

    }

    $(window).on('resize', function() {
      if($_GLOBAL.FLAG.isBreakpointSwitched) {
        // console.log('test');
      }
    });


    // console.log($_GLOBAL);
  })(window.APP, window.APP.COMMON);


})(jQuery, document, this);
