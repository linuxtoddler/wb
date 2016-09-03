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
        type: 'GET',
        refreshToken: true
      }).then(function(result) {
        if (result.code == "0") {
          xjs.setUserInfo(result.content[0]);
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

  // 返回顶部按钮
  // function createBackTopMenu() {
  //   var btn = $('#ui-backTop');
  //   btn.on('click', function(event) {
  //     xjs.scroll(0, 200);
  //   });

  //   $(window).on('scroll', function() {
  //     if (document.body.scrollTop > 200) {
  //       btn.addClass('show').removeClass('hide');
  //     } else {
  //       btn.addClass('hide').removeClass('show');
  //     }
  //   });
  // }
  
  start = function() {
    updateUserInfo();    
    listenHashChange();

    xjs.ui = createUI();

    // xjs.logout = function() {
    //   xjs.ui.popup({
    //     content: '您确定要退出登录吗？',
    //     btns: [
    //       {
    //         name: '确定',
    //         then: function() {
    //           xjs.load({
    //             url: 'member/exitLogin.do',
    //             type: 'POST'
    //           }).then(function() {
    //             location.href = xjs.url().domain + '#home/';
    //             location.reload();
    //           });
    //         }
    //       },
    //       {
    //         name: '取消'
    //       }
    //     ]
    //   });
    // };

    // createBackTopMenu();

    xjs.ui.loading.hide(500);
  };

  xjs.ready(start);
})(xjs);
