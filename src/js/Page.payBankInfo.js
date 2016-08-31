(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.payBankInfo', [base], {
    title: '获取万博收款银行卡',
    templateString: __include('pages/Page.payBankInfo.html'),
    baseClass: 'page-deposit page-paybankinfo fade in'
  });
})(xjs);