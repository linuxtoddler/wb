(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitWechatPayOrder', [base], {
    title: '微信存款',
    templateString: __include('pages/Page.submitWechatPayOrder.html'),
    baseClass: 'page-paymentorder fade in'
  });
})(xjs);