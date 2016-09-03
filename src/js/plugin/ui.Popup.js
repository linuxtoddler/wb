(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('ui.Popup', [base], {
    applyTpl: __include('pages/common/popup.html'),
    baseClass: 'ui-popup',
    show: function() {
      this.$domNode.addClass('fadein');
    },
    hide: function() {
      this.$domNode.removeClass('fadein');
    },
    setParam: function(param) {
      this.btns = param;
    },
    update: function(type) {
      var that = this;
      if (type == 'alert') {
        this.$domNode.addClass('ui-alert');
        this.templateString = this.applyTpl;
        that.buildRender();
        return function(content, delay) {
          that.$contentNode.html(content);
          that.show();
          setTimeout(function() {
            that.hide();
          }, delay || 2000);
        };
      } else {
        return function(param) {
          var tpl = that.applyTpl;
          that.setParam(param.btns);
          tpl = tpl.replace('${TITLE}', param.title ? '<p>' + param.title + '</p>' : '');
          tpl = tpl.replace('${CONTENT}', param.content);
          if (param.btns) {
            tpl = tpl.replace('${BUTTON}', function() {
              var btnTpl = '';
              for (var i = 0; i < param.btns.length; i++) {
                btnTpl += '<div class="tab-cell"><button class="btn" data-xjs-event="tap: fnCall;" data-index="' + i + '">' + param.btns[i].name + '</button></div>';
              }
              return btnTpl;
            });
          }
          that.templateString = tpl;
          that.buildRender();
          that.show();
        };
      }
    },
    fnCall: function(e) {
      var target = $(e.target);
      var id = target.data('index');
      var fn = this.btns[id].then;
      if (fn) xjs.hitch(this, fn)();
      this.hide();
    }
  });

})(xjs);