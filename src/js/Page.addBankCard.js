(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.addBankCard', [base], {
    title: '绑定银行卡',
    templateString: __include('pages/Page.addBankCard.html'),
    baseClass: 'page-addbankcard fade in'
  });
})(xjs);