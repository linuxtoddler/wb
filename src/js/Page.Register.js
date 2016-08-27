(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Register', [base], {
    title: '免费注册',
    templateString: __include('pages/Page.Register.html'),
    baseClass: 'page-register fade in',
    formValidate: {
      input: {
        username: {
          error: '请输入账号'
        },
        password: {
          error: '请输入6~20位长度的密码',
          check: function(val) {
            return xjs.validates.password(val);
          }
        },
        repassword: {
          error: '两次输入的密码不一致',
          check: function(val, data) {
            return val == '' || data.password != val ? 0 : 1; 
          }
        },
        realname: {
          error: '请输入您的真实姓名',
          check: function(val) {
            return /[\u4e00-\u9fa5]{2,4}/.test(val);
          }
        },
        phone: {
          error: '请输入长度为11位的手机号码',
          check: function(val) {
            return xjs.validates.mobile(val);
          }
        },
        weixin: {
          error: '请输入您的微信账号'
        }
      },
      success: function(data) {
        var dtd = $.Deferred();
        if (!data.agreement) {
          xjs.ui.popup({
            content: '您必须同意注册条款',
            btns: [{name: '确定'}]
          });
          dtd.resolve();
        } else {
          delete data.agreement;
          delete data.repassword;
          xjs.load({
            url: "api/register",
            data: data
          }).then(function(result) {
            dtd.resolve();
            xjs.router.navigator('#login/');
          });
        }
        return dtd.promise();
      }
    },
    startup: function() {
      new Swiper(this.bannerNode, {
        paginationClickable: true,
        loop: true,
        autoplay: 5000,
        lazyLoading: true,
        lazyLoadingOnTransitionStart: true,
        lazyLoadingInPrevNextAmount: 3
      });
    }
  });
})(xjs);