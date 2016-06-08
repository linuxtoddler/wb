(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Withdrawals', [base], {
    title: '我要提款',
    templateString: __include('pages/Page.Withdrawals.html'),
    baseClass: 'page-withdrawals fade in'
  });
})(xjs);