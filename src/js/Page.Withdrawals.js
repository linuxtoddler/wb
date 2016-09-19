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
          error: '请输入提款金额',
          check: function(s) {
            return !isNaN(s);
          }
        },
        transcation: {
          error: '您输入的验证码有误',
          check: function(s) {
            return xjs.validates.smscode(s);
          }
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