(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.submitPaymentOrder', [base], {
    title: '填写汇款单',
    templateString: __include('pages/Page.submitPaymentOrder.html'),
    baseClass: 'page-paymentorder fade in',
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
    			check: function(s) {
    				if (s == '') {
    					return '请输入银行卡卡号';
    				} else if (isNaN(s) && !/^\d{16}|\d{19}$/.test(s)) {
    					return '您输入的银行卡号有误';
    				}
    			}
    		},
    		transferProvince: {
    			error: '请选择银行卡开户省会'
    		},
    		transferCity: {
    			error: '请选择银行卡开户城市'
    		}
    	}
    },
    addressParam: {
    	province: '[id="Province"]',
    	city: '[id="City"]',
    	placeholder: false
    }
  });
})(xjs);