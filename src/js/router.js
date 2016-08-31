(function() {
	// 使用正则表达式时类似\w的要改成\\w
	xjs.router.setup({
		'#home/': 'Home', //首页
		'#login/': 'Login', //登陆
		'#join/': 'Register', //注册
		'#promo/': 'Promo', //优惠活动
		'#user/': 'userCenter', //用户中心
		'#account/': 'Account', //个人资料
		'#addcard/': 'addBankCard', //绑定银行卡
		'#withdrawals/': 'Withdrawals', //提款
		'#deposit/(\\d)/': 'Deposit', //存款
		'#tranfers/': 'Tranfers', //游戏转账
		'#paybank/': 'PayBank' //获取充值银行账户
	},
	{
		before: function(hash, dtd) {
			xjs.destroyView();
			xjs.lazyload.clean();

			document.body.scrollTop = 0;
		},
		fail: function() {
			xjs.ui.popup({
				content: '您访问的页面不存在！',
				btns: [
					{
						name: '返回首页',
						then: function() {
							xjs.router.navigator('#home/');
						}
					},
					{
						name: '取消'
					}
				]
			});
		}
	});

	xjs.router.define('Home', function() {
		xjs.createView('Page.Home');
	});

	xjs.router.define('Login', function(backHash) {
		xjs.createView('Page.Login').query = {
			backHash: backHash
		};
	});

	xjs.router.define('Register', function() {
		xjs.createView('Page.Register');
	});

	xjs.router.define('Promo', function() {
		xjs.createView('Page.Promo');
	});

	xjs.router.define('userCenter', true, function() {
		xjs.createView('Page.userCenter');
	});

	xjs.router.define('Account', true, function() {
		xjs.createView('Page.Account');
	});

	xjs.router.define('addBankCard', true,function() {
		xjs.createView('Page.addBankCard');
	});

	xjs.router.define('Withdrawals', true,function() {
		xjs.createView('Page.Withdrawals');
	});

	xjs.router.define('Deposit', true,function(paymentId) {
		xjs.createView('Page.Deposit', {paymentId: paymentId});
	});

	xjs.router.define('Tranfers', true,function() {
		xjs.createView('Page.Tranfers');
	});

	xjs.router.define('PayBank', true,function() {
		xjs.createView('Page.payBankInfo');
	});
})();