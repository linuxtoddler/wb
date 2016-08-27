(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Tranfers', [base], {
    title: '我要转账',
    templateString: __include('pages/Page.Tranfers.html'),
    baseClass: 'page-tranfers fade in',
  });
})(xjs);