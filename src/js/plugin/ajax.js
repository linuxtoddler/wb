(function($) {
  var cache = {};

  xjs.load = function(data) {
    var param = _.extend({
      skipError: false, //将错误信息交给回调执行
      offAnimate: false, //关闭动画效果
      showShadow: false, //显示动画遮罩层
      useCache: false, //使用缓存数据
      type: 'POST',
      dataType: 'json'
    }, data);
    
    var skipError = param.skipError;
    var offAnimate = param.offAnimate;
    var showShadow = param.showShadow;
    var refreshToken = param.refreshToken;
    var useCache = param.useCache;
    if (xjs.ui && !offAnimate) xjs.ui.loading.show(showShadow);

    delete param.skipError;
    delete param.offAnimate;
    delete param.showShadow;
    delete param.refreshToken;
    delete param.useCache;

    if (refreshToken) {
      param.headers = {Authorization: "bearer " + xjs.getToken()};
    }

    var wait = function() {
      var dtd = $.Deferred();
      if (!useCache || (useCache && !cache[param.url])) {
        $.ajax(param).then(function(result, status, xhr) {
          if (refreshToken) {
            xjs.setToken(xhr.getResponseHeader("Authorization"));
          }
          if (result.code != '0' && !skipError) return dtd.reject(result.code, result.msg, offAnimate);
          if(useCache) cache[param.url] = result;
          dtd.resolve( skipError ? result : result.content );
          if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
        }, failRequiest);
      } else {
        var data = cache[param.url];
        if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
        dtd.resolve( skipError ? data : data.content );
      }
      return dtd.promise();
    };
    return $.when(wait()).fail(errorRequiest);
  };

  function errorRequiest(code, error, offAnimate) {
    if (xjs.ui && !offAnimate) xjs.ui.loading.hide();
    if (code == '3') { //如果用户未登录
      return setTimeout(function() {
        xjs.cleanToken();
        xjs.setUserInfo(null);
        xjs.router.navigator('#login/', {backHash: location.hash}, true);
      }, 200);
    }
    xjs.ui.popup({
      content: error,
      btns: [{name: '确定'}]
    });
  }

  function failRequiest() {
    xjs.ui && xjs.ui.loading.hide();
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
  }
})($);