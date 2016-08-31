(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitWechatPayOrder', [base], {
    title: '微信存款',
    templateString: __include('pages/Page.submitWechatPayOrder.html'),
    baseClass: 'page-paymentorder fade in',
    formValidate: {
    	input: {
    		nickname: {
    			error: '请输入您的微信账号'
    		},
    		money: {
    			error: '请输入充值金额',
    			check: function(val) {
    				return /^\d{1,5}$/.test(val);
    			}
    		}
    	},
    	success: function(data) {
				xjs.load({
					url: 'api/weixinpay',
					data: data
				}).then(function(result) {
					console.log(result);
				});
    	}
    }
  });
})(xjs);