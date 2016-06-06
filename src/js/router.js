(function() {
	// 使用正则表达式时类似\w的要改成\\w
	xjs.router.setup({
		'#home/': 'Home',
		'#login/': 'Login',
		'#join/': 'Register'
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
})();