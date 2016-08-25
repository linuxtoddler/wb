(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Register', [base], {
    title: '免费注册',
    templateString: __include('pages/Page.Register.html'),
    baseClass: 'page-register fade in',
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