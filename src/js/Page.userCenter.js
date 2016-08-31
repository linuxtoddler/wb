(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.userCenter', [base], {
    title: '用户中心',
    templateString: __include('pages/Page.userCenter.html'),
    baseClass: 'page-usercenter fade in'
  });
})(xjs);