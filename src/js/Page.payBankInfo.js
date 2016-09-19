(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.payBankInfo', [base], {
    title: '获取万博收款银行卡',
    templateString: __include('pages/Page.payBankInfo.html'),
    baseClass: 'page-deposit page-paybankinfo fade in',
    request: function() {
    	var billNo = xjs.url().param.billno;
    	return {
    		app: 'payment',
    		url: 'api/getpaymentinfo',
    		refreshToken: true,
    		data: {
    			billNo: billNo
    		}
    	};
    },
    confirmOrder: function() {
    	var billNo = xjs.url().param.billno;
    	xjs.load({
    		url: 'api/successpay',
    		refreshToken: true,
    		data: {
    			billNo: billNo
    		}
    	}).then(function() {
    		xjs.ui.popup({
    			content: '您的订单已提交到财务审核',
    			btns: [{
    				name: '确定'
    			}]
    		});
    	});
    },
    cancelOrder: function() {
    	var billNo = xjs.url().param.billno;
    	xjs.load({
    		url: 'api/cancelpay',
    		refreshToken: true,
    		data: {
    			billNo: billNo
    		}
    	}).then(function() {
    		xjs.ui.popup({
    			content: '您的订单已取消',
    			btns: [{
    				name: '返回上一页',
    				then: function() {
    					history.go(-1);
    				}
    			}]
    		})
    	});
    }
  });
})(xjs);