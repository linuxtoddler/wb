(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Home', [base], {
    title: '万博 - 世界老虎机游戏先驱',
    templateString: __include('pages/Page.Home.html'),
    baseClass: 'page-home fade in',
    startup: function() {
      new Swiper(this.bannerNode, {
        paginationClickable: true,
        loop: true,
        autoplay: 5000,
        lazyLoading: true,
        lazyLoadingOnTransitionStart: true,
        lazyLoadingInPrevNextAmount: 3
      });
      this.$lobbysNode.on('tap', 'img', function() {
        var name = $(this).data('lobby');
        if (!xjs.getUserInfo()) {
          xjs.ui.popup({
            content: '您需要先登录才能进入游戏',
            btns: [{
              name: '确定',
              then: function() {
                xjs.router.navigator('#login/', {backHash: '#home/'});
              }
            }]
          })
        } else {
          xjs.load({
            url: 'api/' + name,
            refreshToken: true
          }).then(function(result) {
            location.href = result.url;
          });
        }
      });
    }
  });
})(xjs);