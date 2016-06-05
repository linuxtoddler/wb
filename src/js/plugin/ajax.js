(function() {
	xjs.load = function(param) {
		var param = _.extend({
			skipError: false, //将错误信息交给回调执行
			offAnimate: false, //关闭动画效果
			showShadow: false, //显示动画遮罩层
      type: 'POST',
      dataType: 'json'
		}, param);
		
    var skipError = param.skipError;
    var offAnimate = param.offAnimate;
    var showShadow = param.showShadow;
    if (xjs.ui && !offAnimate) xjs.ui.loading.show(showShadow);

    delete param.skipError;
    delete param.offAnimate;
    delete param.showShadow;
    var wait = function() {
      var dtd = $.Deferred();
      $.ajax(param).then(function(result) {
        if (result.code != '0' && !skipError) return dtd.reject(result.code, result.msg);
        dtd.resolve( skipError ? result : result.content );
        if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
      }, function(result) {
        if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
        xjs.ui.popup({
        	content: '网络异常请稍后重试!',
        	btns: [
        		{
        			name: '重试',
        			then: function() {
        				location.reload();
        			}
        		},
        		{
        			name: '返回首页',
        			then: function() {
        				xjs.router.navigator('#home/');
        			}
        		}
        	]
        });
      });
      return dtd.promise();
    };
    return $.when(wait()).fail(function(code, error) {
      if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
      if (code == '3') { //如果用户未登录
        return setTimeout(function() {
          location.hash = '#login/';
          location.reload();
        }, 200);
      }
      xjs.ui.alert(error);
    });
  };
})();