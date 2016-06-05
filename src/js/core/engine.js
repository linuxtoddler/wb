(function(window){
  window.xjs = xjs = {};

  var containerNode = document.getElementById('appview');
  var _class = {};
  var _examples = {};

  xjs.createView = function(name, param, wrapper) {
    if (!wrapper) {
      wrapper = document.createElement('div');
      $(containerNode).prepend(wrapper);
    } else {
      wrapper = $(wrapper).get(0);
    }
    return xjs.getDeclare(name, param || {}, wrapper);
  };

  xjs.destroyView = function() {
    if (!Object.getOwnPropertyNames(_examples).length) return;
    // $(content).unbind().remove();
    $.each(_examples, function(id, widget) {
      if (!widget.keepInside) {
        _examples[id].$domNode.off().remove();
        delete _examples[id];
      };
    });
  };

  xjs.getDeclare = function(name, param, node) {
    return arguments.length > 1 ? (function(){
      node.id = (function() {
        var o = 0, taskname = name.replace(/\./, '_') + '_';
        while (_examples[taskname + o]) {
          o += 1;
        }
        return taskname + o;
      })();

      // node.className = 'app-content';

      return _examples[node.id] = mixinProp( [_class[name]], param || {}).init(node);
    })() : _class[name];
  };

  xjs.declare = function(classname, parents, prop) {
    _class[classname] = mixinProp(parents, prop);
  };

  xjs.byId = function(id) {
    var id = id.indexOf('#') >= 0 ? id.substr(1) : id;
    return _examples[id];
  };
  
  function mixinProp (parents, prop) {
    if (!prop) {
      prop = parents;
      parents = [{}];
    };
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var _super = parents[0];
    var prototype = _.create(parents[0]);

    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);  
            //离开时 保存现场环境，恢复值。
            this._super = tmp;
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    return prototype;
  };
})(window);