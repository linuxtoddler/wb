(function(xjs) {
  var user, start;
  xjs.getUserInfo = function() {
    return user;
  };

  /**
   * [setUserInfo description]
   * @param {Object} data [设置用户数据]
   */
  xjs.setUserInfo = function(data) {
    user = data;
  };

  xjs.setToken = function(token) {
    localStorage.wbToken = token;
  }

  xjs.getToken = function() {
    return localStorage.wbToken || false;
  }

  xjs.cleanToken = function() {
    delete localStorage.wbToken;
  }

  // 渲染默认组建
  function createUI() {
    return {
      popup: xjs.createView('ui.Popup', {keepInside: true}).update('popup'),
      alert: xjs.createView('ui.Popup').update('alert'),
      loading: xjs.createView('ui.Loading', null, '#ui-loading')
    };
  }

  // 检查用户是否登陆并更新登陆信息
  function updateUserInfo() {
    if (xjs.getToken()) {
      xjs.load({
        url: 'api/getmember',
        offAnimate: true,
        skipError: true,
        refreshToken: true
      }).then(function(result) {
        if (result.code == "0") {
          xjs.setUserInfo(result.content);
        } else {
          xjs.cleanToken();
        }
        xjs.router.start();
      });
    } else {
      xjs.router.start();
    }
  }

  // 监听路由改变
  function listenHashChange() {
    $('body').on('click', 'a', function(event) {
      var target = event.currentTarget;
      var href = xjs.url(target.href);
      if (href.domain == xjs.url().domain) {
        event.preventDefault();
        if(location.hash != '#' + href.hash) {
          xjs.router.navigator('#' + href.hash);
        }
      }
    });
  }
  
  start = function() {
    updateUserInfo();    
    listenHashChange();

    xjs.ui = createUI();

    xjs.ui.loading.hide(500);
  };

  xjs.ready(start);
})(xjs);
