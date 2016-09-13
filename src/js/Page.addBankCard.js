(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.addBankCard', [base], {
    title: '绑定银行卡',
    templateString: __include('pages/Page.addBankCard.html'),
    baseClass: 'page-addbankcard fade in',
    request: function() {
    	return [
	    	{
	    		app: 'banklist',
	    		url: 'api/banklist',
	    		type: 'GET'
	    	},
	    	{
	    		app: 'bindcard',
	    		url: 'api/showbindcard',
	    		refreshToken: true
	    	}
    	];
    },
    formValidate: {
    	input: {
    		bindbank: {
    			error: '请选择银行'
    		},
    		province: {
    			error: '请选择开户省'
    		},
    		branch: {
    			error: '请输入银行分支'
    		},
    		card: {
    			error: '您输入的银行卡有误',
    			check: function(s) {
  					return /^\d{16}|\d{19}$/.test(s);
    			}
    		},
    		witbtitVerifi: {
    			error: '请输入11位的手机号码',
    			check: function(s) {
            return xjs.validates.smscode(s);
    			}
    		}
    	},
      success: function(obj) {
        xjs.load({
          url: 'api/bindbank',
          refreshToken: true,
          data: obj
        }).then(function() {
          xjs.ui.popup({
            content: '银行卡绑定成功!',
            btns: [{
              name: '确定',
              then: function() {
                xjs.router.navigator('#addcard/');
              }
            }]
          });
        });
      }
    },
    addressParam: {
    	province: '[id="province"]',
    	city: '[id="city"]',
    	placeholder: false
    }
  });
})(xjs);