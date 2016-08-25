(function() {
	_.extend(xjs, {
    $: $,
    ready: function(fn) {
      return $(fn);
    },
    url: function(url) {
      var dm, hs, qu;
      url = url || location.href;
      dm = url.match(/^[^?#]+/i)[0];
      url = url.slice(dm.length);
      if (url.match(/^\?[^#]+/i)) {
        qu = url.match(/^\?[^#]+/i)[0];
        url = url.slice(qu.length);
        if (url.match(/^#[^?]+/i)) {
          hs = url.match(/^#[^?]+/i)[0];
        }
      } else if (url.match(/^#[^?]+/i)) {
        hs = url.match(/^#[^?]+/i)[0];
        url = url.slice(hs.length);
        if (url.match(/^\?[^#]+/i)) {
          qu = url.match(/^\?[^#]+/i)[0];
        }
      }
      url = {
        domain: dm,
        query: (qu || '').slice(1),
        hash: (hs || '').slice(1),
        param: {},
        toString: function() {
          var key, ref, val;
          qu = '';
          ref = this.param;
          for (key in ref) {
            val = ref[key];
            qu += key;
            if (val !== void 0 && val !== null) {
              qu += '=' + val;
            }
          }
          if (qu) {
            qu = '?' + qu;
          }
          hs = this.hash ? '#' + this.hash : '';
          return this.domain + qu + hs;
        }
      };
      if (url.query) {
        url.query.replace(/(?:^|&)([^=&]+)(?:=([^&]*))?/gi, function(a, b, d) {
          return url.param[b] = d;
        });
      }
      return url;
    },
    formToObject: function(form, trim) {
      var data;
      if (!form.serializeArray) {
        form = $(form);
      }
      data = {};
      if (trim === void 0) {
        trim = 1;
      }
      $.each(form.serializeArray(), function(i, field) {
        return data[field.name] = trim ? $.trim(field.value) : field.value;
      });
      return data;
    },
    serialize: function(form) {
      if (form.nodeName !== 'FORM') return;
      var form = xjs.$(form).serialize().replace(/\+/g, '').split('&'),
          obj = {}, data, i;
      for (i = 0; i < form.length; i++) {
        data = form[i];
        obj[ data.match(/(\w+)=/)[1] ] = decodeURIComponent(data.match(/=(.*)$/)[1]);
      };
      return obj;
    },
    hitch: function(context, fn) {
      var args = [].slice.call(arguments, 2);
      return function() {
        return fn.apply(context || this, [].slice.call(arguments).concat(args));
      };
    },
    validates: {
      mobile: function(s) {
        s = xjs.$.trim(s);
        return s && /^1[3587][0-9]{9}$/.test(s);
      },
      password: function(s) {
        s = xjs.$.trim(s);
        return s && /^[^\s]{6,20}$/i.test(s);
      },
      smscode: function(s) {
        s = xjs.$.trim(s);
        return s && /^\w{4,6}$/i.test(s);
      },
      cncheck: function(s) {
        s = xjs.$.trim(s);
        return s && /.*[\u4e00-\u9fa5]+.*$/.test(s);
      },
      idcard: function(s) {
        var reg15, reg18;
        s = xjs.$.trim(s);
        reg15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{2}(\d|x)$/i;
        reg18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x)$/i;
        return s && (reg15.test(s) || reg18.test(s));
      },
      mail: function(s) {
        s = xjs.$.trim(s);
        return s && /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(s);
      }
    },
    scroll: function(scrollTo, time) {
      var scrollFrom = parseInt(document.body.scrollTop),
          i = 0,
          runEvery = 5; // run every 5ms

      time = time || 200;
      scrollTo = parseInt(scrollTo);
      time /= runEvery;

      var interval = setInterval(function () {
        i++;
        document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
        if (i >= time) {
          clearInterval(interval);
        }
      }, runEvery);
    },
    bind: function(select, type, fn) {
      $(select).on(type, fn);
      return {
        remove: function() {
          $(select).off(type, fn);
        }
      };
    },
    onlineService: function() {
      var a = "https://www.chat800.com/chat/chatClient/chatbox.jsp?companyID=285&configID=75",
          b = encodeURIComponent(document.URL),
          c = encodeURIComponent(document.referrer);
      window.open(a + "&enterurl=" + b + "&pagereferrer=" + c);
    },
    QQService: function(dom) {
      var qq = $(dom).data('param-qq');
      var url = "mqqwpa://im/chat?chat_type=crm&uin=" + qq + "&version=1&src_type=web";
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        // 尝试打开本地APP
        window.location = url;
        // 如果500ms后还没打开应用，则认为本机不存在该app，跳转到相应页面
      } else if (navigator.userAgent.match(/android/i)) {// andriod系统
        // 打开状态
        var state = null;
        try {
          // 尝试打开本地APP
          state = window.open(url, '_blank');
        } catch (e) {
          xjs.ui.alert('打开QQ客服失败，请重试！');
        }
        if (!state) {
          xjs.ui.alert('抱歉您并未安装QQ，无法使用QQ客服');
        }
      }
    },
    WechatService: function() {
      xjs.ui.popup({
        content: '<img src="/assets/images/wechat-qrcode.jpg"><br>请扫描并关注xbet的微信公众账号',
        btns: [{name: '关闭'}]
      });
    },
    cookietoObject: function() {
      var cookie = document.cookie.split(';'), 
          obj = {},
          val;
      for (var i = 0; i < cookie.length; i++) {
        val = cookie[i].split('=');
        obj[val[0]] = val[1];
      }
      return obj;
    },
    isAndroid: function() {
      return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    },
    isIOS: function() {
      return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
  });
})();