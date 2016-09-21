(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Withdrawals', [base], {
    title: '我要提款',
    templateString: __include('pages/Page.Withdrawals.html'),
    baseClass: 'page-withdrawals fade in',
    request: function() {
    	return [{
    		app: 'bindcard',
    		url: 'api/showbindcard',
    		refreshToken: true
    	}];
    },
    formValidate: {
      input: {
        money: {
          check: function(s) {
            s = Number(s);
            if (!s) {
              return "您输入的金额有误";
            } else if (s > Number(xjs.getUserInfo().money)) {
              return "提款金额不能超过账户余额";
            }
            return true;
          }
        },
        transaction: {
          error: '请输入交易口令'
        }
      },
      success: function(obj) {
        xjs.load({
          url: 'api/withdrawal',
          refreshToken: true,
          data: obj
        }).then(function() {
          xjs.ui.popup({
            content: '您的提款申请已提交，请等待后台审核',
            btns: [{
              name: '确定',
              then: function() {
                xjs.router.navigator('#user/');
              }
            }]
          });
        });
      }
    }
  });
})(xjs);