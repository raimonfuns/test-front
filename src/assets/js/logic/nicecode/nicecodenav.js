//默认靓号列表：/service/web/nicecode/index/codelist
//换一批YY靓号：/service/web/nicecode/index/randomImList
//换一批情侣靓号：/service/web/nicecode/index/randomLoversImList
//换一批频道号：/service/web/nicecode/index/randomSessionNumberList
//每日推荐：/service/web/nicecode/index/ranking
//靓号评估：/service/web/nicecode/evaluate
//我的购买信息：/service/web/nicecode/mine/info

define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");

	
	function getHostRelative(url) {
		var host = "null";
		if (typeof url == "undefined" || null == url) url = window.location.href;
		var regex = /.*\:\/\/([^\/]*).*/;
		var match = url.match(regex);
		if (typeof match != "undefined" && null != match) host = match[1];
		return url.substring(url.indexOf(host) + host.length);
	}
	$('.nicecode-nav').find('a').each(function(i, e) {
		var _u = getHostRelative();
		if (_u.indexOf($(e).attr('href')) == 0) {
			$(e).addClass('active');
			return false;
		}
	}); 


});