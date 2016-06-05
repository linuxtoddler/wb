(function(xjs) {
	var targetArray = [], loadY, onload, status;
	var openStatus = true;

	var update = function(target) {
		var img = $(target);
		var param = {targetY: img.offset().top, img: target};
		if (img.data('loaded')) return;
		if (!targetArray.length) {
			targetArray.push(param);
		} else {
			for (var i = 0; i < targetArray.length; i++) {
				if (param.targetY < targetArray[i].targetY) {
					return targetArray.splice(i, 0, param);
				} else if (param.targetY == targetArray[i].targetY) {
					var copy = targetArray[i];
					if (copy.imgs) {
						copy.imgs.push(param.img);
					} else {
						copy = {
							imgs: [copy.img, param.img],
							targetY: param.targetY
						};
					}
					return targetArray.splice(i, 1, copy);
				} else if(i == targetArray.length - 1) {
					return targetArray.splice(i + 1, 0, param);
				}
			}
		};
	};

	var createLoad = function() {
		if (loadY) return;
		loadY = 1;
		setTimeout(function() {
			var target;
			loadY = window.innerHeight + document.body.scrollTop + 200;
			for (var i = 0; i < targetArray.length; i++) {
				target = targetArray[i];
				if (target.targetY < loadY) {
					$(target.img || target.imgs).each(function() {
						var realUrl = $(this).data('src');
						$(this).data('loaded', true).attr('src', realUrl);
					});
					targetArray.splice(i, 1);
					i -= 1;
				}
			}
			return loadY = 0;
		}, 250);
	};

	$(window).on('scroll', function() {
		if (!openStatus) return;
		createLoad();
	});

	xjs.lazyload = {
		update: update,
		on: function () {
			openStatus = true;
			setTimeout(createLoad, 100); //触发首屏加载
		},
		off: function() {
			openStatus = false;
			loadY = 0;
		},
		clean: function() {
			targetArray = [];
		}
	};
})(xjs);