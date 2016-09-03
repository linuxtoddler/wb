(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('ui.Loading', [base], {
    keepInside: true, //当页面切换时不会删除当前模块
    baseClass: 'ui-loading fadein shadow',
    times: 0,
    show: function(showShadow) {
      this.times += 1;
      this.$domNode[!showShadow ? 'removeClass' : 'addClass']('shadow');
      this.$domNode.show().removeClass('fadeout').addClass('fadein');
    },
    hide: function(delay) {
      this.times -= 1;
      if (this.times <= 0) {
        this.$domNode.removeClass('fadein').addClass('fadeout');
        this.times = 0;
      }
    }
  });

})(xjs);