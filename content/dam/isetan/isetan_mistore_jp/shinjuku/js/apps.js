(function($, document, window) {
  // 厳格モード ON
  "use strict";

  // グローバルオブジェクトである window の配下に APP と言うオブジェクトを追加設定する。
  // window.APPもグローバルオブジェクトなので、どのページからでも参照できる。
  window.APP = window.APP || {};

  // window.APPを引数に入れた即時関数
  // $_GLBAL = window.APP = グローバルオブジェクト
  (function($_GLOBAL) {

    // ::::::::::::::::::::::::::::::::::::::::
    // GLOBAL SETTING
    // ::::::::::::::::::::::::::::::::::::::::

    // サイト全体で使用する変数を登録
    $_GLOBAL.VAR = {
      windowWidth: -1,
      windowHeight: -1,
      scrollTop: -1,
      scrollBottom: -1,
      device: -1,
      tmpDevice: -1,
      PC_WIDTH: 1024
    }

    // サイト全体で使用するフラグを登録
    $_GLOBAL.FLAG = {
      isBreakpointSwitched: false
    }

    // ブラウザやデバイスを判別
    $_GLOBAL.IDENTIFIER = {
      platform: navigator.platform,
      ua: navigator.userAgent,
      appversion: navigator.appVersion,
      isiOS: (/iphone|ipod|ipad|android/gi).test(navigator.appVersion),
      isiPod: navigator.userAgent.indexOf('ipod') > -1 ? true : false,
      isiPhone: navigator.userAgent.indexOf('iPhone') > -1 ? true : false,
      isiPad: navigator.userAgent.indexOf('iPad') > -1 ? true : false,
      isAndroid: navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') > 0 ? true : false,
      isAndroidTab: navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') < 0 ? true : false,
      pixelRatio: !!window.devicePixelRatio ? window.devicePixelRatio : 1,
      imageRatioSfx: !!window.devicePixelRatio ? ((window.devicePixelRatio <= 1.5 ) ? 1 : 2) : 1,
      isTouchDevice: (typeof document.ontouchstart !== "undefined"),
      isIE:(/msie/gi).test(navigator.userAgent),
      isIE9lt:(/msie 6\.|msie 7\.|msie 8\./gi).test(navigator.appVersion),
      windowScrollTag: ( window.chrome || 'WebkitAppearance' in document.documentElement.style ) ? 'body' : 'html'
    }

    // サイト全体で使用するエレメントを登録
    $_GLOBAL.ELEM = {
      html: $('html'),
      body: $('body'),
      global: $('#base'),
      gHeader: $('#baseHeader'),
      gNav: $('#globalNav'),
      gContent: $('#baseContent'),
      gFooter: $('#baseFooter')
    }

    $_GLOBAL.HANDLER = {
      resize: 'load resize scroll'
    };

    // 以下で定義した関数をグローバル関数にする
    $_GLOBAL.FUNC = {
      isBreakpointSwitched: function() {
        isBreakpointSwitched();
      },
      easyIntroAnimation: function(cb) {
        easyIntroAnimation(cb);
      }
    }

    // ::::::::::::::::::::::::::::::::::::::::
    // EVENT
    // ::::::::::::::::::::::::::::::::::::::::


    // ::::::::::::::::::::::::::::::::::::::::
    // FUNCTIONS
    // ::::::::::::::::::::::::::::::::::::::::

    // - 値を取得する
    // ========================================
    function getValue() {
      // $_GLOBAL.VARに値を代入
      $_GLOBAL.VAR.windowWidth = $(window).width();
      $_GLOBAL.VAR.windowHeight = $(window).height();
      $_GLOBAL.VAR.scrollTop = $(window).scrollTop();
      $_GLOBAL.VAR.scrollBottom = $_GLOBAL.VAR.scrollTop + $_GLOBAL.VAR.windowHeight;
      $_GLOBAL.VAR.device = $_GLOBAL.ELEM.body.css('z-index');
      $_GLOBAL.VAR.tmpDevice = $_GLOBAL.VAR.device;

      // 読み込み時
      $(window).on('load', function() {
        $_GLOBAL.VAR.windowWidth = $(window).width();
        $_GLOBAL.VAR.windowHeight = $(window).height();
        $_GLOBAL.VAR.device = $_GLOBAL.ELEM.body.css('z-index');
        $_GLOBAL.VAR.tmpDevice = $_GLOBAL.VAR.device;
        // console.group('___ GLOBAL VAR');
        // console.log($_GLOBAL.VAR);
        // console.groupEnd('___ GLOBAL VAR');
      });

      // スクロール時
      $(window).on('scroll', function() {
        // console.log($_GLOBAL.VAR);
      });

      // リサイズ時
      $(window).on('resize', function() {
        $_GLOBAL.VAR.windowWidth = $(window).width();
        $_GLOBAL.VAR.windowHeight = $(window).height();
        $_GLOBAL.VAR.device = $_GLOBAL.ELEM.body.css('z-index');
        // console.log($_GLOBAL.VAR);
      });

      $(window).on($_GLOBAL.HANDLER.resize, function() {
        $_GLOBAL.VAR.scrollTop = $(window).scrollTop();
        $_GLOBAL.VAR.scrollBottom = $_GLOBAL.VAR.scrollTop + $_GLOBAL.VAR.windowHeight;
      });
    }

    (function eventHandlerPreference() {
      if($_GLOBAL.IDENTIFIER.isTouchDevice) {
        $_GLOBAL.HANDLER.mouseup = 'touchend';
        $_GLOBAL.HANDLER.mousedown = 'touchstart';
      } else {
        $_GLOBAL.HANDLER.mouseup = 'mouseup';
        $_GLOBAL.HANDLER.mousedown = 'mousedown';
      }
      // console.log($_GLOBAL.IDENTIFIER);
      // console.log($_GLOBAL.HANDLER);
    })();

    // - ブレイクポイントの切り替わりを判別
    // - $_GLOBAL.FLAG.isBreakpointSwitched がtrueになる
    // =============================
    function isBreakpointSwitched() {
      var device, _device, timer;
      $(window).on('resize', function() {

        $_GLOBAL.FLAG.isBreakpointSwitched = false;
        device = $_GLOBAL.VAR.device;

        if(_device !== device) {
          // console.log('::: BREAKPOINT SWITCHED ' + _device + ' to ' + device + ' :::');
          $_GLOBAL.FLAG.isBreakpointSwitched = true;
          _device = $_GLOBAL.VAR.device;
        }

      });
    }

    (function footerPushBottom() {
      var $header = $_GLOBAL.ELEM.gHeader;
      var $content = $_GLOBAL.ELEM.gContent;
      var $footer = $_GLOBAL.ELEM.gFooter;

      var contentHeight;

      $(window).on('load resize', function() {
        contentHeight = $(window).height() - $header.outerHeight() - $footer.outerHeight();
        $content.css('min-height', contentHeight);
      });
    })();


    // - アンカーリンククリック
    // =============================
    function scrollToAnker() {
      var $conf = {
        speed: 1200,
        easing: 'easeOutCubic'
      }
      $('a[href^="#"]').on('click', function() {
        var headerHeight = $('#globalHeader').outerHeight();
        var href= $(this).attr('href');
        var target = $(href == '#' || href == '' ? 'html' : href);
        var position = target.offset().top - headerHeight;
        // console.log(href, target, position);
        $('html, body').stop().animate({
          scrollTop:position
        }, $conf.speed, $conf.easing);
        return false;
      });
    }
    scrollToAnker();


    function easyIntroAnimation(cb) {

      // 設定
      // --------------------

      // 操作するDOMの設定
      var baseElem = '#base';
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



    // console.group('___ GLOBAL IDENTIFIER');
    // console.log($_GLOBAL.IDENTIFIER);
    // console.groupEnd('___ GLOBAL IDENTIFIER');
    //
    // console.group('___ GLOBAL VAR');
    // console.log($_GLOBAL.VAR);
    // console.groupEnd('___ GLOBAL VAR');

    // console.group('___ GLOBAL');
    // console.log($_GLOBAL);
    // console.groupEnd('___ GLOBAL');

    getValue();
    $_GLOBAL.FUNC.isBreakpointSwitched();


  })(window.APP);

})(jQuery, document, this)
