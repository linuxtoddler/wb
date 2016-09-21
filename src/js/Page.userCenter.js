(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.userCenter', [base], {
    title: '用户中心',
    templateString: __include('pages/Page.userCenter.html'),
    baseClass: 'page-usercenter fade in',
    onLogout: function(e) {
    	e.preventDefault();
    	xjs.ui.popup({
    		content: '确定退出登录?',
    		btns: [{
    			name: '确定',
    			then: function() {
			    	xjs.setUserInfo(0);
			    	xjs.router.navigator('#home/');
    			}
    		},{
    			name: '取消'
    		}]
    	})
    }
  });
})(xjs);