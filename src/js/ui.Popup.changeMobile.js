(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Popup');
      
  declare('ui.Popup.changeMobile', [base], {
    baseClass: 'ui-popup page-account-dialog',
    formValidate: { //定义修改手机号码的表单验证规则
      input: {
        code: {
          error: '请输入四位短信验证码',
          check: function(val) {
            return xjs.validates.smscode(val);
          }
        },
        phonenumber: {
          error: '请输入11位手机号码',
          check: function(val) {
            return xjs.validates.mobile(val);
          }
        }
      },
      success: function(data) { //表单通过前端验证时的回调
        var oldParam = {
          phonenumber: xjs.getUserInfo().phone,
          code: data.code
        }
        var formplugin = this;
        xjs.load({ //提交旧的手机号码以及短信验证码
          url: 'api/check',
          data: oldParam
        }).then(function() {
          xjs.load({ //上传新的手机号码
            url: 'api/updateinfo',
            refreshToken: true,
            data: {
              field: 'phone',
              value: data.phonenumber
            }
          }).then(function() {
            xjs.ui.popup({ //提交成功后弹窗提示
              content: '手机号码修改成功！',
              btns: [
                {
                  name: '确定',
                  then: function() {
                    formplugin.replaceNode.value = data.phonenumber; //刷新用户信息页面的手机号码显示
                  }
                }
              ]
            });
          });
        });
      }
    },
    startup: function() {
      var that = this;
      setTimeout(function() { //延迟100毫秒等待表单验证元素渲染完成
        that.plugins[0].$sendCodeNode.on('tap', xjs.hitch(that.plugins[0], function(e) { //监听获取验证码的按钮点击事件
          var btn = $(e.target);
          var phone = xjs.getUserInfo().phone;
          if (btn.hasClass('sended')) return; //检查是否正在发送过程中
          btn.addClass('sended').html('短信已发送');
          xjs.load({
            url: 'api/send',
            data: {phonenumber: phone},
            skipError: true
          }).then(function(result) {
            var count = 0;
            var timer = setInterval(function() { //设定倒计时
              btn.html((count += 1) + '秒');
              if (count == 60) {
                clearInterval(timer);
                btn.removeClass('sended').html('获取验证码');
              }
            }, 1000);
          });
        }));
      }, 100);
    },
    fnCall: function() {
      this.$formNode.trigger('submit'); //当弹窗的确定按钮被点击时 触发表单的提交，前端验证通过后 将会触发formValidate里的success回调
    },
    hide: function() {
      xjs.destroyView(this.plugins[0].id); //删除弹窗对象里的表单元素
      xjs.destroyView(this.id); //删除弹窗对象
      this._super();
    }
  });

})(xjs);