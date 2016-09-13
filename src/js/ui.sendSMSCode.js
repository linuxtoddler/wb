(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');
      
  declare('ui.sendSMSCode', [base], {
    startup: function() {
      this.$domNode.on('tap', xjs.hitch(this, function(e, btn) {
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
      }, this.$domNode));
    }
  });
})(xjs);