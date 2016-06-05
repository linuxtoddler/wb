(function(xjs) {
  var declare = xjs.declare;

  declare('ui.Widget', {
    init: function(dom) {
      this.render(dom);
      $.when(this.syncGetData()).done(
        xjs.hitch(this, function() {
          this.buildRender();
          this.startup && this.startup();
        })
      );
      return this;
    },
    render: function(dom) {
      document.title = this.title || document.title;
      this.domNode = this.domNode || (this.$domNode = $(dom)).get(0);
      this.id = this.domNode.id;
    },
    syncGetData: function() {
      var o = this.request ? this.request() : 0, dtd = $.Deferred();
      if (!o) return dtd.resolve();
      if (o.then) {
        o.done(xjs.hitch(this, waitRequest));
        return dtd.promise();
      };
      xjs.hitch(this, waitRequest)(o);
      function waitRequest(param) {
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
      };
      return dtd.promise();
    },
    buildRender: function() {
      this.$domNode.addClass(this.baseClass);
      if (this.templateString) {
        this.domNode.innerHTML = _.template(this.templateString)(this);
      }
      __createNode.call(this) && __createEvent.call(this) && __minxinProp.call(this);

      xjs.lazyload[this.lazyload ? 'on' : 'off'](); //开启延迟加载
      if (xjs.ui) xjs.ui.loading.hide();

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
})(xjs);