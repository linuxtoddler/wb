(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('plugin.address', [base], {
    startup: function() {
      if (localStorage.addressJSON) {
        this.addressJSON = JSON.parse(localStorage.addressJSON);
        this.listen();
      } else {
        xjs.load({
          url: '/assets/json/address.json',
          skipError: true,
          type: 'GET'
        }).then(xjs.hitch(this, function(result) {
          localStorage.addressJSON = JSON.stringify(result);
          this.addressJSON = result;
          this.listen();
        }));
      }
    },
    listen: function() {
      var group = this.parent.parent.addressParam, province;
      this.$provinceNode = this.$domNode.find(group.province);
      this.$cityNode = group.city ? this.$domNode.find(group.city) : false;
      this.$areaNode = group.area ? this.$domNode.find(group.area) : false;
      if (group.placeholder) this.$provinceNode[0].options.add(new Option(group.defaultOption || '', ''));
      for (var i = 0; i < this.addressJSON.length; i++) {
        province = this.addressJSON[i].name;
        this.$provinceNode[0].options.add(new Option(province, province));
      }
      // 需要修改id传参的方法
      this.$provinceNode.on('change', xjs.hitch(this, function(e) {
        var val = e.target.value;
        if (!val) return;
        for (var i = 0; i < this.addressJSON.length; i++) {
          if (this.addressJSON[i].name == val) {
            this.$provinceNode.data('select', i);
            this.$cityNode.data('select', 0);
            this.$cityNode && this.createCityList();
            this.$areaNode && this.createAreaList();
            return;
          }
        };
      }));
      this.$cityNode && this.$cityNode.on('change', xjs.hitch(this, function(e) {
        var val = e.target.value;
        var provinceId = this.$provinceNode.data('select');
        if (!val || !provinceId) return;
        for (var i = 0; i < this.addressJSON[provinceId].city.length; i++) {
          if (this.addressJSON[provinceId].city[i].name == val) {
            this.$cityNode.data('select', i);
            this.createCityList();
            this.createAreaList();
            return;
          }
        };
      }));
    },
    createCityList: function() {
      var provinceId = this.$provinceNode.data('select');
      var citys = this.addressJSON[provinceId].city;
      this.$cityNode[0].options.length = 0;
      for (var i = 0; i < citys.length; i++) {
        this.$cityNode[0].options.add(new Option(citys[i].name, citys[i].name));
      }
    },
    createAreaList: function() {
      var provinId = this.$provinceNode.data('select');
      var cityId = this.$cityNode.data('select');
      var areas = this.addressJSON[provinId].city[cityId].area;
      this.$areaNode[0].options.length = 0;
      for (var i = 0; i < areas.length; i++) {
        this.$areaNode[0].options.add(new Option(areas[i], areas[i]));
      }
    }
  });

})(xjs);