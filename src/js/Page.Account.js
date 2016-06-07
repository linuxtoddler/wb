(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Account', [base], {
    title: '用户中心',
    templateString: __include('pages/Page.Account.html'),
    baseClass: 'page-account fade in'
  });
})(xjs);