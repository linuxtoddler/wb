(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitWechatPayOrder', [base], {
    title: '微信存款',
    templateString: __include('pages/Page.Deposit.html'),
    contentTpl: __include('pages/Page.submitWechatPayOrder.html'),
    baseClass: 'page-deposit page-paymentorder fade in',
    request: function() {
      return {
        app: 'promolist',
        url: 'api/activitylist',
        refreshToken: true,
        type: 'GET'
      };
    },
    buildRender: function() {
      this.templateString = this.templateString.replace('${CONTENT}', this.contentTpl);
      this._super();
    },
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
          refreshToken: true,
          data: data
				}).then(function(result) {
					location.href = result.url;
				});
    	}
    }
  });
})(xjs);