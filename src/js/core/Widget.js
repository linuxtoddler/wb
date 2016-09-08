(function(xjs) {
  var declare = xjs.declare;
  // 定义基类对象
  declare('ui.Widget', {
    // 初始化以及执行顺序控制函数
    init: function(dom) {
      this.domNode = this.domNode || (this.$domNode = $(dom)).get(0);
      this.id = this.domNode.id;
      $.when(this.syncGetData()).done(
        xjs.hitch(this, function() {
          this.buildRender();
          this.startup && this.startup();
        })
      );
      return this;
    },
    /**
     * [syncGetData 调用this.request函数获取页面初始化前的请求列表]
     * @return {[Deferred]}       [返回Deferred异步回调方法]
     */
    syncGetData: function() {
      var o = this.request ? this.request() : 0, dtd = $.Deferred();
      if (!o) return dtd.resolve();
      if (o.then) {
        o.done(xjs.hitch(this, waitRequest));
        return dtd.promise();
      }
      xjs.hitch(this, waitRequest)(o, dtd);
      return dtd.promise();
    },
    /** [buildRender 渲染模板，并注册event事件以及node代理对象] */
    buildRender: function() {
      this.$domNode.addClass(this.baseClass);
      if (typeof this.templateString == 'function') {
        this.domNode.innerHTML = this.templateString(this);
      } else if (typeof this.templateString == 'string') {
        this.domNode.innerHTML = _.template(this.templateString)(this);
      }
      __createNode.call(this) && __createEvent.call(this) && __minxinProp.call(this);
    }
  });
  function __createNode() {
    var doms, dom, parents, n, i;
    doms = this.domNode.querySelectorAll('[data-xjs-element]');
    doms = Array.prototype.slice.call(doms);
    for (i = 0; i < doms.length; i++) {
      dom = $(doms[i]);
      parents = dom.parents('[data-xjs-mixin]');
      if (parents.length && parents[0] != this.domNode) break;
      n = dom.data('xjs-element');
      this[n] = ( this['$' + n] = dom ).get(0);
    }
    return true;
  }
  function __createEvent() {
    var doms, dom, parents, n, i;
    doms = this.domNode.querySelectorAll('[data-xjs-event]');
    doms = Array.prototype.slice.call(doms);
    if (this.$domNode.data('xjs-event')) doms.push(this.domNode);
    for (i = 0; i < doms.length; i++) {
      var fns = {}, f, j;
      dom = $(doms[i]);
      parents = dom.parents('[data-xjs-mixin]');
      if (parents.length && parents[0] != this.domNode) break;
      n = dom.data('xjs-event');
      f = n.replace(/\s/g, "").split(';').slice(0, -1);
      for (j = 0; j < f.length; j++) {
        var event = f[j].split(':');
        dom.on(event[0], xjs.hitch(this, this[event[1]]));
      }
    }
    return true;
  }
  function __minxinProp() {
    var doms, parents, n, i;
    doms = this.domNode.querySelectorAll('[data-xjs-mixin]');
    for (i = 0; i < doms.length; i++) {
      var node = doms[i], declare;
      parents = $(doms[i]).parents('[data-xjs-mixin]');
      if (parents.length && parents[0].id != this.id) break;
      n = doms[i].attributes['data-xjs-mixin'].nodeValue;
      declare = xjs.getDeclare(n, {parent: this}, node);
      if (this.plugins) {
       this.plugins.push(declare); 
      } else {
        this.plugins = [declare];
      }
    }
    return true;
  }
  function waitRequest(param, dtd) {
    var param = param instanceof Array ? param : [param], i, name, count = 0;
    this.data = this.data || {};
    for (i = 0; i < param.length; i++) {
      name = param[i].app;
      if(!param[i].hasOwnProperty('showShadow')) param[i].showShadow = true;
      delete param[i].app;
      xjs.load( param[i] ).then(
        xjs.hitch(this, function(reslute, key) {
          this.data[ key ] = reslute;
          count += 1;
          if (count == param.length) dtd.resolve();
        }, name)
      );
    }
  }
})(xjs);