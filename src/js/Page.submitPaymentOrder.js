(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitPaymentOrder', [base], {
    title: '填写汇款单',
    templateString: __include('pages/Page.Deposit.html'),
    contentTpl: __include('pages/Page.submitPaymentOrder.html'),
    baseClass: 'page-deposit page-paymentorder fade in',
    buildRender: function() {
      this.templateString = this.templateString.replace('${CONTENT}', this.contentTpl);
      this._super();
    },
    request: function() {
    	return [
	    	{
	    		app: 'banklist',
	    		url: 'api/banklist',
	    		type: 'GET'
	    	},
	    	{
	    		app: 'payment',
	    		url: 'api/deposittype',
	    		type: 'GET'
	    	},
	    	{
	    		app: 'promolist',
	    		url: 'api/activitylist',
          refreshToken: true,
	    		type: 'GET'
	    	}
    	]
    },
    formValidate: {
    	input: {
    		transferMode: {
    			error: '请选择汇款方式'
    		},
    		transferBank: {
    			error: '请选择转账银行'
    		},
    		transferName: {
    			error: '请输入2至4位中文名',
    			check: function(s) {
    				return /[\u4e00-\u9fa5]{2,4}/.test(s);
    			}
    		},
    		transferMoney: {
    			error: '请输入转账金额',
    			check: function(s) {
    				return !isNaN(s) && s != 0;
    			}
    		},
    		transferCard: {
          error: '您输入的银行卡号有误',
    			check: function(s) {
    				// if (s == '') {
    					// return '请输入银行卡卡号';
    				// } else if (isNaN(s) && !/^\d{16}|\d{19}$/.test(s)) {
    					return /^\d{16}|\d{19}$/.test(s);
    				// }
    			}
    		},
    		transferProvince: {
    			error: '请选择银行卡开户省会'
    		},
    		transferCity: {
    			error: '请选择银行卡开户城市'
    		}
    	},
      success: function(obj) {
        xjs.load({
          url: 'api/submitpay',
          refreshToken: true,
          data: obj
        }).then(function(result) {
          xjs.ui.popup({
            content: '汇款信息提交成功，请将款项汇到我们指定的银行帐号。',
            btns: [{
              name: '确定',
              then: function() {
                xjs.router.navigator('#paybank/?billno=' + result.billno);
              }
            }]
          })
        });
      }
    },
    addressParam: {
    	province: '[id="Province"]',
    	city: '[id="City"]',
    	placeholder: false
    }
  });
})(xjs);