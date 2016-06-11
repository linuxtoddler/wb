(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Deposit', [base], {
    title: '我要存款',
    templateString: __include('pages/Page.Deposit.html'),
    _paymentBankTpl: __include('pages/Page.PaymentBank.html'),
    baseClass: 'page-deposit fade in',
    buildRender: function() {
    	var tpl = this.templateString;
    	if (this.paymentId == 1) {
    		tpl = tpl.replace('${CONTENT}', this._paymentBankTpl);
    	} else if (this.paymentId == 2) {
    		tpl = tpl.replace('${CONTENT}', this._paymentAlipayTpl);
    	} else {
    		tpl = tpl.replace('${CONTENT}', this._paymentWechatTpl);
    	}
    	this.templateString = tpl;
    	this._super();
    }
  });
})(xjs);