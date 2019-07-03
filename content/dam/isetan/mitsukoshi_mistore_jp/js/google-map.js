(function($, document, window) {
  "use strict";
  window.APP = window.APP || {};
  window.APP.GOOGLE_MAP = window.APP.GOOGLE_MAP || {};

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
    // (function initMap() {
    //   let $googleMap = $('.js-google-map');
    //
    //   $googleMap.each(function() {
    //     let $map = $(this)[0];
    //     let lat = $(this).attr('data-lat');
    //     let lng = $(this).attr('data-lng');
    //
    //     let icon;
    //
    //     let latlng = new google.maps.LatLng(lat, lng);
    //
    //     let myOptions = {
    //       zoom: 17, /*拡大比率*/
    //       center: latlng, /*表示枠内の中心点*/
    //       mapTypeControlOptions: { mapTypeIds: ['decom'] },
    //       scrollwheel: false,
    //       draggable: false,
    //     };
    //
    //     let map = new google.maps.Map($map, myOptions);
    //
    //     // マーカー
    //     let marker = new google.maps.Marker({
    //       position: latlng,
    //       title:"Hello World!"
    //     });
    //     marker.setMap(map);
    //
    //
    //   });
    //
    // })();


    $(window).on('load', function() {
    });

    $(window).on('resize', function() {
    });


  })(window.APP, window.APP.GOOGLE_MAP);


})(jQuery, document, this);
