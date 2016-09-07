(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Popup');
      
  declare('ui.Popup.changePassword', [base], {
    baseClass: 'ui-popup page-account-dialog',
    formValidate: { //定义修改手机号码的表单验证规则
      input: {
        prepassword: {
          error: '请输入6~20位长度的密码',
          check: function(val) {
            return xjs.validates.password(val);
          }
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
            return val === data.password ? true : false;
          }
        }
      },
      success: function(data) { //表单通过前端验证时的回调
        popupClass = this.parent;
        xjs.load({ //验证旧密码
          url: 'api/updateinfo',
          refreshToken: true,
          data: {
            field: 'prepassword',
            value: data.prepassword
          }
        }).then(function() {
          xjs.load({ //上传新密码
            url: 'api/updateinfo',
            refreshToken: true,
            data: {
              field: 'password',
              value: data.prepassword
            }
          }).then(function() {
            xjs.ui.popup({ 
              content: '登陆密码修改成功！',
              btns: [
                {
                  name: '确定',
                  then: function() {
                    popupClass.replaceNode.value = data.phonenumber; //刷新用户信息页面的手机号码显示
                    popupClass.hide();
                  }
                }
              ]
            });
          });
        });
      }
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