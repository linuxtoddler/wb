(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitAlipayOrder', [base], {
    title: '支付宝存款',
    templateString: __include('pages/Page.submitAlipayOrder.html'),
    baseClass: 'page-alipayorder fade in'
  });
})(xjs);