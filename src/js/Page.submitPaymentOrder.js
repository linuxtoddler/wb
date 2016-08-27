(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitPaymentOrder', [base], {
    title: '填写汇款单',
    templateString: __include('pages/Page.submitPaymentOrder.html'),
    baseClass: 'page-paymentorder fade in'
  });
})(xjs);