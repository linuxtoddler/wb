(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitAlipayOrder', [base], {
    title: '支付宝存款',
    templateString: __include('pages/Page.Deposit.html'),
    contentTpl: __include('pages/Page.submitAlipayOrder.html'),
    baseClass: 'page-deposit page-alipayorder fade in',
    buildRender: function() {
    	this.templateString = this.templateString.replace('${CONTENT}', this.contentTpl);
    	this._super();
    }
  });
})(xjs);