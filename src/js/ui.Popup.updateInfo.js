(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Popup');
      
  declare('ui.Popup.updateInfo', [base], {
    baseClass: 'ui-popup page-account-dialog',
    fnCall: function() {
      this.$formNode.trigger('submit'); //当弹窗的确定按钮被点击时 触发表单的提交，前端验证通过后 将会触发formValidate里的success回调
    },
    hide: function() {
      xjs.destroyView(this.plugins[0].id); //删除弹窗对象里的表单元素
      xjs.destroyView(this.id); //删除弹窗对象
    }
  });

})(xjs);