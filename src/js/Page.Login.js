(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Login', [base], {
    title: '万博 账号登录',
    templateString: __include('pages/Page.Login.html'),
    baseClass: 'page-login fade in',
    formValidate: {
      input: {
        name: {
          error: '请输入账号'
        },
        password: {
          error: '请输入6~20位长度的密码',
          check: function(val) {
            return xjs.validates.password(val);
          }
        },
        cpt: {
          error: '请输入验证码',
          check: function(val) {
            return xjs.validates.smscode(val);
          }
        }
      },
      imgCode: 'codeNode',
      success: function(data) {
        var dtd = $.Deferred();
        xjs.load({
          url: "api/login",
          data: data,
          skipError: true
        }).then(function(result) {
          if (result.code == '0') {
            xjs.setToken(result.content.token);
            xjs.load({
              url: 'api/getmember',
              refreshToken: true
            }).then(function(result) {
              xjs.setUserInfo(result[0]);
              if (xjs.router.state && xjs.router.state.tonewsite) location.href = xjs.router.state.tonewsite;
              xjs.router.navigator(xjs.router.state && xjs.router.state.backHash ? xjs.router.state.backHash : '#home/', null, true);
            });
          } else {
            xjs.ui.popup({
              content: result.msg,
              btns: [{name: '确定'}]
            });
            dtd.resolve();
          }
        });
        return dtd.promise();
      }
    }
  });

})(xjs);