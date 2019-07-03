(function($, document, window) {
  "use strict";
  window.APP = window.APP || {};
  window.APP.VIEWPORT = window.APP.VIEWPORT || {};

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

    (function viewportSwitch() {
      var viewport = $('head').find('meta[name=viewport]');
      viewport.attr('content', 'width=1024, initial-scale=0, user-scalable=yes');
    })();


  })(window.APP, window.APP.VIEWPORT);


})(jQuery, document, this);
