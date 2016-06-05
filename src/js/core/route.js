(function() {
  function Router(){};
  Router.prototype.definemap = {};
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
      var request = this.callback.before(activeHash, dtd);
      var jump = function () {
        history[replaceHash ? 'replaceState' : 'pushState'](state, null, hash);
        this.state = state;
        result.route.Func.apply(window, matchResult);
      };
      if (request instanceof Object) {
        $.when(request).then(xjs.hitch(this, jump));
      } else {
        jump();
      }
    }
  };
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
})();