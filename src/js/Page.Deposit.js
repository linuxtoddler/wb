(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Deposit', [base], {
    title: '我要存款',
    templateString: __include('pages/Page.Deposit.html'),
    baseClass: 'page-deposit fade in',
    startup: function() {
    	if (this.paymentId == 1) {
        xjs.createView('Page.submitPaymentOrder', {}, this.containerNode);
    	} else if (this.paymentId == 2) {
        xjs.createView('Page.submitAlipayOrder', {}, this.containerNode);
    	} else {
        xjs.createView('Page.submitWechatPayOrder', {}, this.containerNode);
    	}
    }
  });
})(xjs);