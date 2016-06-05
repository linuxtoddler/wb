(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Login', [base], {
    title: 'XBET 账号登录',
    templateString: __include('pages/Page.Login.html'),
    baseClass: 'page-login fade in',
    formValidate: {
      input: {
        userName: {
          error: '请输入账号'
        },
        password: {
          error: '请输入6~20位长度的密码',
          check: function(val) {
            return xjs.validates.password(val);
          }
        },
        code: {
          error: '请输入验证码',
          check: function(val) {
            return xjs.validates.smscode(val);
          }
        }
      },
      imgCode: 'codeNode',
      success: function(obj) {
        var dtd = $.Deferred();
        xjs.load({
          url: "member/login.do",
          type: "POST",
          data: obj,
          skipError: true
        }).then(function(result) {
          if (result.code == '0') {
            if (xjs.router.state && xjs.router.state.tonewsite) location.href = xjs.router.state.tonewsite;
            xjs.setUserInfo(true);
            xjs.router.navigator(xjs.router.state && xjs.router.state.backHash ? xjs.router.state.backHash : '#home/', null, true);
          } else {
            xjs.ui.alert(result.msg);
            dtd.resolve();
          }
        });
        return dtd.promise();
      }
    }
  });

})(xjs);