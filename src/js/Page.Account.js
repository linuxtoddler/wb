(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Account', [base], {
    title: '个人资料',
    templateString: __include('pages/Page.Account.html'),
    baseClass: 'page-account fade in'
  });
})(xjs);