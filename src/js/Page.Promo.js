(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Promo', [base], {
    title: '万博 - 世界老虎机游戏先驱',
    templateString: __include('pages/Page.Promo.html'),
    baseClass: 'page-promo fade in',
    startup: function() {
      new Swiper(this.bannerNode, {
        paginationClickable: true,
        loop: true,
        autoplay: 5000,
        lazyLoading: true,
        lazyLoadingOnTransitionStart: true,
        lazyLoadingInPrevNextAmount: 3
      });
    }
  });
})(xjs);