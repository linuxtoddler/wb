(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Account', [base], {
    title: '个人资料',
    templateString: __include('pages/Page.Account.html'),
    baseClass: 'page-account fade in',
    request: function() {
      return {
        app: 'checkSecret',
        url: 'api/checksecret',
        refreshToken: true,
        type: 'GET'
      };
    },
    changeMobile: function() {
    	var popup = xjs.createView('ui.Popup.changeMobile', {
        replaceNode: this.phoneNode
      });
    	popup.update('popup')({ //设定弹窗为popup类型 以及弹窗内容，并弹出
    		title: '修改手机号码',
    		content: __include('pages/common/popup-changemobile.html'),
    		btns: [{
    			name: '确定'
    		}]
    	});
    },
    changePassword: function() {
      var popup = xjs.createView('ui.Popup.changePassword');
      popup.update('popup')({
        title: '修改登陆密码',
        content: __include('pages/common/popup-changepassword.html'),
        btns: [{
          name: '确定'
        }]
      });
    },
    updateInfo: function(param) {
      var popup = xjs.createView('ui.Popup.updateInfo', {
        inputType: param.inputType || 'text',
        placeholder: param.placeholder,
        formValidate: {
          input: param.validate,
          success: function(data) {
            var newData = {};
            newData[param.field] = data.info;
            xjs.load({
              url: param.url,
              refreshToken: true,
              data: newData
            }).then(function() {
              xjs.ui.popup({ //提交成功后弹窗提示
                content: param.success,
                btns: [
                  {
                    name: '确定',
                    then: function() {
                      if (param.replaceNode) {
                        param.replaceNode.value = data.info;
                        if(param.field == 'qq') param.replaceNode.nextSibling.style.display = "none"; //隐藏修改按钮
                      }
                      popup.hide();
                    }
                  }
                ]
              });
            });
          }
        }
      });
      popup.update('popup')({
        title: param.title,
        content: __include('pages/common/popup-updateinfo.html'),
        btns: [{name: '确定'}]
      });
    },
    changeWechat: function() {
      this.updateInfo({
        url: 'api/updatewx',
        title: '修改微信号',
        validate: {
          error: '不能留空，请重新输入'
        },
        placeholder: '请输入新的微信号码',
        success: '微信号码修改成功！',
        field: 'weixin',
        replaceNode: this.wechatNode
      });
    },
    changeQQ: function() {
      this.updateInfo({
        url: 'api/updateqq',
        title: '修改QQ号',
        inputType: 'number',
        validate: {
          error: '请输入您的QQ号码'
        },
        placeholder: '请输入您的QQ号码',
        success: 'QQ号码修改成功！',
        field: 'qq',
        replaceNode: this.qqNode
      });
    },
    changeSecret: function() {
      var popup = xjs.createView('ui.Popup.changeSecret', {
        replaceNode: this.secretNode
      });
      popup.update('popup')({ //设定弹窗为popup类型 以及弹窗内容，并弹出
        title: '修改交易口令',
        content: __include('pages/common/popup-changesecret.html'),
        btns: [{
          name: '确定'
        }]
      });
    }
    // changeEmail: function() {
    //   this.updateInfo({
    //     title: '修改电子邮箱地址',
    //     validate: {
    //       error: '您输入的邮箱格式不正确',
    //       check: function(val) {
    //         return xjs.validates.mail(val);
    //       }
    //     },
    //     placeholder: '请输入您的邮箱地址',
    //     success: '邮箱地址修改成功！',
    //     field: 'email',
    //     replaceNode: this.qqNode
    //   });
    // }
  });
})(xjs);