(function($) {
  function Router(){};
  Router.prototype.definemap = {};
  /**
   * [setup 路由定义函数]
   * @param  {[Object]} routemap [路由映射表]
   * @param  {[Object]} cb       [提供before和fail函数回调，对应路由变化前和路由失败后的回调]
   */
  Router.prototype.setup = function(routemap, cb) {
    var rule, func;
    this.routemap = [];
    this.callback = cb;
    for (rule in routemap) {
      if (!routemap.hasOwnProperty(rule)) continue;
      this.routemap.push({
        rule: new RegExp('^' + rule + '$', 'i'),
        quote: routemap[rule]
      });
    };
  };
  /**
   * [define 定义路由回调]
   * @param  {[String]}  name      [路由名称]
   * @param  {[Boolean]} authorize [为true时，会判断用户是否登陆]
   * @param  {Function} cb         [路由回调]
   */
  Router.prototype.define = function(name, authorize, cb) {
    if (!cb) {
      cb = authorize; 
      authorize = false;
    };
    for (var way in this.routemap) {
      route = this.routemap[way];
      if (route.quote == name) return this.definemap[name] = {
        Func: cb,
        authorize: authorize,
        rule: route.rule
      };
    };
  };
  /**
   * [navigator 改变路由函数]
   * @param  {[String]} hash         [路由地址]
   * @param  {[Object]} state        [提供给路由回调的参数]
   * @param  {[Boolean]} replaceHash [为true时 会覆盖路由列表中的最后一个地址]
   */
  Router.prototype.navigator = function(hash, state, replaceHash) {
    var hash = hash || '#home/';
        activeHash = location.hash,
        result = this.verify(hash),
        dtd = $.Deferred(),
        state = state || {};
    if (!result) {
      return this.callback.fail();
    } else {
      var matchResult = result.matchResult.slice(1);
      if (result.route.authorize && !xjs.getUserInfo()) {
        state.backHash = hash;
        replaceHash = false;
        result = this.verify(hash = '#login/');
      }
      $.when(this.callback.before(activeHash, dtd)).then(xjs.hitch(this, function() {
        history[replaceHash ? 'replaceState' : 'pushState'](state, null, hash);
        this.state = state;
        result.route.Func.apply(window, matchResult);
      }));
    }
  };
  /**
   * [start 路由启动函数]
   */
  Router.prototype.start = function() {
    var that = this;
    function onHashChange (e) {
      var param = [];
      if (location.hash) {
        param.push(location.hash);
        if (e && e.isTrusted) {
          param.push(null, true);
        }
        that.navigator.apply(that, param);
      } else {
        that.navigator('#home/', null, true);
      }
    };
    window.onhashchange = onHashChange;
    onHashChange();
  };
  /**
   * [verify 路由地址验证方法]
   * @param  {[RegExp]} hash [路由地址]
   * @return {[Object]}      [返回在路由表中匹配的上的对象]
   */
  Router.prototype.verify = function(hash) {
    var route, matchResult;
    var hash = hash.indexOf('?') > 0 ? hash.slice(0, hash.indexOf('?')) : hash;
    for (var obj in this.definemap) {
      var route = this.definemap[obj];
      matchResult = hash.match(route.rule);
      if (matchResult) return {
        route: route,
        matchResult: matchResult
      };
    };
    return false;
  };

	return xjs.router = new Router;
})($);