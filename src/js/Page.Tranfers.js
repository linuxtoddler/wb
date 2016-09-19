(function(xjs) {
  var declare = xjs.declare,
      base = xjs.getDeclare('ui.Widget');

  declare('Page.Tranfers', [base], {
    title: '我要转账',
    templateString: __include('pages/Page.Tranfers.html'),
    baseClass: 'page-tranfers fade in',
    request: function() {
      return {
      	app: 'lobbys',
      	url: 'api/listaccount',
      	type: 'GET'
      };
    },
    formValidate: {
    	input: {
    		turnOut: {
    			error: '请选择转出平台'
    		},
    		turnInto: {
    			check: function(val, obj) {
    				if (!val) {
    					return '请先择转入平台';
    				} else if (val == obj.turnOut) {
    					return '不能选择相同的转入、转出平台';
    				}
    				return true;
    			}
    		},
    		tranMoney: {
    			error: '请输入转账金额'
    		},
    		tranPass: {
    			error: '请输入交易指令'
    		}
    	},
    	success: function(obj) {
    		xjs.load({
    			url: 'api/getnameandphone',
    			refreshToken: true,
    			data: obj
    		}).then(function() {
    			xjs.ui.popup({
    				content: '转账成功！',
    				btns: [{
    					name: '确定',
    					then: function() {
    						xjs.router.navigator('#user/');
    					}
    				}]
    			})
    		});
    	}
    }
  });
})(xjs);