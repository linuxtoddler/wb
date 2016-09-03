/**
 * [表单验证插件 请在当前Class对象中添加formValidate并配置一下参数，当有多个表单时请使用数组组织下列参数，并添加id对应每个form表单]
 * @param {[String]} id [可选参数，当有多个form表单需要验证时需要设置key为id的值与form表单的data-id相同]
 * @param {Object} input [需要验证的input列表]
 *   @param {Object} [inputname] [将需要验证的input的name设置为key]
 *       @param {String} [error] [可选参数，设置错误提示信息，未设置则由check函数返回错误信息]
 *       @param {[Function]} check [可选参数，当不存在check函数的时候默认只验证是否填写，通过return判断成功与否]
 *         @arguments {[String]} [当前input的值]
 *         @arguments {[Object]} [当前form表单所有input的值]
 *         @return {[Boolean]} [返回true代表验证成功，false则失败。返回字符串则会当作验证失败并提示此字符串]
 * @param {String} imgCode [验证码dom元素，将会从data-xjs-element里匹配]
 * @param {Function} success [验证成功后的回调]
 *   @arguments {[Object]} [当前form表单所有input的值]
 */
(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('plugin.formValidate', [base], {
    startup: function() {
      var param = this.parent.formValidate;
      var domId = this.domNode.dataset.id;
      if (this.parent.formValidate instanceof Array) {
        this.valiparam = (function() {
          for (var i = 0; i < param.length; i++) {
            if (param[i].id == domId) {
              return param[i];
            }
          }
        })();
      } else {
        this.valiparam = param;
      }

      this.createPopups(this.valiparam);

      if (param.imgCode) {
        this['$' + param.imgCode].on('tap', this.changeCode).trigger('tap');
      }

      this.$domNode.on('change', xjs.hitch(this, function(e) {
        var dom = $(e.target);
        var active = this.valiparam.input[e.target.name];
        if (e.target.type == 'submit' || !active) return;
        var result = active.check ? active.check(dom.val(), xjs.formToObject(this.domNode)) : 1;
        if (!active) return;
        if (!result || typeof result == 'string') {
          active.status = false;
          this.openPopup(dom, _.extend(_.create(active), result ? {error: result} : {}));
        } else if (!dom.val()) {
          active.status = false;
          this.openPopup(dom, active);
        } else {
          active.status = true;
          dom.removeClass('error');
          this.closePopup(active);
        }
      }));

      this.$domNode.on('submit', xjs.hitch(this, this.onSubmit));

      this.scrollTo = xjs.hitch(this, scrollTo)();
    },
    createPopups: function(param) {
      var popupFrag = document.createDocumentFragment();
      for (var i in param.input) {
        var node = param.input[i].popup = document.createElement('div');
        node.className = 'error-popup';
        popupFrag.appendChild(node);
      }
      this.$domNode.append(popupFrag);
    },
    openPopup: function(dom, param) {
      var parent = dom.parent();
      var offset = {
        left: parent.get(0).offsetLeft,
        top: parent.get(0).offsetTop
      };
      var popup = $(param.popup);
      var height = popup.width(dom.width()).html('<p><span>' + param.error + '</span></p>').height();
      this.scrollTo(offset.top - height - 100);
      dom.addClass('error');
      popup.css({
        left: offset.left,
        top: offset.top - height - 10,
        opacity: 1
      });
    },
    closePopup: function(param) {
      if (!param.type) {
        param.popup.style.opacity = 0;
      } else {
        this.listenTap.remove();
        $.each(this.valiparam.input, function(key, val) {
          val.popup.style.opacity = 0;
        });
      }
    },
    onSubmit: function(e) {
      e.preventDefault();
      var fromNode = e.target, obj;
      this.checkallObj(function(status) {
        if (!status) {
          obj = xjs.formToObject(fromNode);
          var dtd = xjs.hitch(this, this.valiparam.success, obj)();
          if (dtd && this.valiparam.imgCode) {
            $.when(dtd).then(xjs.hitch(this, function() {
              this['$' + this.valiparam.imgCode].trigger('tap');
            }));
          }
        } else {
          var that = this;
          setTimeout(function() {
            that.listenTap = xjs.bind('body', 'tap', xjs.hitch(that, that.closePopup));
          }, 100);
        }
      });
    },
    checkallObj: function(cb) {
      var wrong = false;
      for (var i = 0; i < this.domNode.length; i++) {
        var input = this.valiparam.input[this.domNode[i].name];
        if (!input) continue;
        $(this.domNode[i]).trigger('change');
        wrong = wrong || !input.status;
      }
      xjs.hitch(this, cb)(wrong);
    },
    changeCode: function(e) {
      e.target.src = "api/getcaptcha?" + Math.random();
    }
  });

  /**
   * [scrollTo 当验证错误的时候滚动到第一个错误]
   */
  function scrollTo() {
    var targetArray = [], that = this;
    return function(targetY) {
      targetArray.push(targetY);
      setTimeout(function() {
        if (!targetArray.length) return;
        xjs.scroll(targetArray[0]);
        targetArray.length = [];
      }, 100);
    };
  }

})(xjs);