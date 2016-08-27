(function() {
	// 使用正则表达式时类似\w的要改成\\w
	xjs.router.setup({
		'#home/': 'Home', //首页
		'#login/': 'Login', //登陆
		'#join/': 'Register', //注册
		'#promo/': 'Promo', //优惠活动
		'#user/': 'Account', //个人中心
		'#addcard/': 'addBankCard', //绑定银行卡
		'#withdrawals/': 'Withdrawals', //提款
		'#deposit/(\\d)/': 'Deposit', //存款
		'#tranfers/': 'Tranfers'
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

	xjs.router.define('Account', function() {
		xjs.createView('Page.Account');
	});

	xjs.router.define('addBankCard', function() {
		xjs.createView('Page.addBankCard');
	});

	xjs.router.define('Withdrawals', function() {
		xjs.createView('Page.Withdrawals');
	});

	xjs.router.define('Deposit', function(paymentId) {
		xjs.createView('Page.Deposit', {paymentId: paymentId});
	});

	xjs.router.define('Tranfers', function() {
		xjs.createView('Page.Tranfers');
	});
})();