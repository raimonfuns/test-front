define(function(require, exports, module) {
	var $ = jQuery = require("../lib/jquery.min.js");


	var ie = getIEVersion(),
		screenStatic = $(window).width() < 1200 ? 'narrow' : 'wide',
		timer = null;

	$(window).resize(function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			screenWatch();

		}, 300);
	});

	screenWatch();


	//屏幕大小监控
	function screenWatch() {
		var W = $(window).width();
		//IE8以下窄屏适配
		if (ie !== -1 && ie < 9) {
			if (W < 1200) {
				$("body").removeClass("screen-wide");
			} else {
				$("body").addClass("screen-wide");
			}
		}
	}
	


	function getIEVersion() {
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		} else if (navigator.appName == 'Netscape') {
			var ua = navigator.userAgent;
			var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})"); //for IE 11
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	}

});