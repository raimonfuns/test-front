define(function(require, exports, module) {
	//var callbacks = $.Callbacks();
	var vip_level_score = {'v1':0,'v2':600,'v3':1800,'v4':3600,'v5':6000,'v6':10800,'v7':29999, 'v8':88888, length:8};
	var dtformate = require('./date');

	function getHost(url) {
		var host = "null";
		if (typeof url == "undefined" || null == url) url = window.location.href;
		var regex = /.*\:\/\/([^\/]*).*/;
		var match = url.match(regex);
		if (typeof match != "undefined" && null != match) host = match[1];
		return host;
	}

	var $ = require('../lib/jquery.min.js');
	$.browser = {};
	$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
	$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
	$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
	$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

	if ($.browser.msie) {
		var _b = navigator.userAgent.indexOf("MSIE ");
		var _v = parseFloat(navigator.userAgent.substring(_b + 5, navigator.userAgent.indexOf(";", _b)));
		if (_v == 6) {
			$(document).ready(function() {
				$('<div style="background-color:#ffffe1;border-bottom:1px solid #f90;font-size:12px;line-height:1.6;"><div style="width:960px;margin:0 auto;color:#f60;text-align:center;">您的IE浏览器版本过低，请升级您的浏览器至IE8+,以体验优质浏览效果，</div></div>').prependTo("body");
			});
		}

	}

	// var host = "http://" + getHost();

	// /************************************/
	// require.async('http://res.udb.duowan.com/lgn/js/oauth/udbsdk/pcweb/udb.sdk.pcweb.popup.min.js', function () {
	// 	UDB.sdk.PCWeb.popupOpenLgn(host + '/service/web/auth/prelogin', host + '/service/web/auth/udblogin', host + '/service/web/auth/fail');
	// });
	// /************************************/

	require.async('http://res.udb.duowan.com/lgn/js/oauth/udbsdk/pcweb/udb.sdk.pcweb.popup.min.js');

	require.async('http://www.duowan.com/duowan.js');


	var host = "http://" + getHost();

	window.showUdbLogin = exports.showUdbLogin = function() {
		UDB.sdk.PCWeb.popupOpenLgn(host + '/service/web/auth/prelogin', host + '/service/web/auth/udblogin', host + '/service/web/auth/fail');
	}
	window.udbLogout = exports.udbLogout = function() {
		$.getScript(host + "/service/web/auth/logout");
	}

	window.udb_callback = exports.udb_callback = function(cookieURL) {
		UDB.sdk.PCWeb.writeCrossmainCookieWithCallBack(cookieURL,
			function() {
				if (document.location.href.indexOf("/login") >= 0) {
					document.location = "/index";
					return false;
				} else {
					if (typeof window.onLoginSuccess == "function") {
						onLoginSuccess();
					} else {
						document.location.reload();
					}
				}

			}
		);
	}

	exports.getHost = getHost;

	//从URL里取得参数名值对的Map, 否则返回空对象
	exports.getMapFromURlParams = function(url) {
		var url = url ? url : window.location.href,
			paramArray = null,
			paramStr = null,
			tempArray = null,
			result = {};

		if (url.indexOf("?") == -1) {
			return result;
		}

		paramStr = url.split("?")[1];

		paramArry = paramStr.split("&");

		for (var i = 0, len = paramArry.length; i < len; i++) {
			tempArray = paramArry[i].split("=");
			result[tempArray[0]] = decodeURIComponent(tempArray[1]);
		}

		return result;
	};

	//从URL里取得hash, 返回hash字符串，没有#
	exports.getHashFromURI = function(url) {
		var url = url ? url : window.location.href,
			result = null,
			position = -1;

		if ((position = url.indexOf("#")) == -1) {
			return result;
		}

		return url.slice(position + 1);
	};

	var userinfo,userLogo,userZZInfo;
	var $ = jQuery = require("../lib/jquery.min.js");

	// 获取userinfo
	$.ajax({
		url: "/service/web/user/info",
		type: 'GET',
		cache: false,
		dataType: 'json',
		success: function(rsp) {
			if(rsp.result && rsp.data.info.vipUser){

				 rsp.data.info.lvScore = vip_level_score['v' + (rsp.data.info.vipLevel + 1)];
				
				 rsp.data.info.lvRate = 0;
				 if(rsp.data.info.vipLevel < vip_level_score.length && rsp.data.info.vipLevel > 0){
				 	rsp.data.info.lvRate = (rsp.data.info.score -  vip_level_score['v' + rsp.data.info.vipLevel] ) * 100/(vip_level_score['v' + (rsp.data.info.vipLevel + 1)] - vip_level_score['v' + rsp.data.info.vipLevel]);
				 }

				 //ow 过期时间 
				 if(rsp.data.info.owVip){
				 	rsp.data.info.owVipExpireTime = (new Date(rsp.data.info.owVipExpireDate)).format('yyyy-mm-dd');

				 }
			}
			userinfo = rsp;
			//callbacks.fire();
		},
		error: function () {
			console.error('获取userinfo失败');
		}
	});

	// 获取userLogo
	$.ajax({
		url: "/service/web/user/logo",
		cache: false,
		dataType: 'json',
		success: function(rsp) {
			if (rsp.result) {
				userLogo = rsp.data;
			}
		}
	});

	// 获取userZZInfo
	$.ajax({
		url: "http://show.vip.yy.com/service/web/vinfo",
		cache: false,
		dataType: 'jsonp',
		success: function(rsp) {
			userZZInfo = rsp;			
		}
	});

	function getUserLogo(callback) {
		if (typeof callback === "function") {
			if (!userLogo) {
				window.setTimeout(function() {
					getUserLogo(callback)
				}, 30);
			} else {
				callback(userLogo);
			}
		}
	}


	function getUserInfo(callback) {
		if (typeof callback === "function") {
			if (!userinfo) {
				window.setTimeout(function() {
					getUserInfo(callback)
				}, 30);
			} else {
				callback(userinfo);
			}
		}
	}

	function getUserZZInfo(callback) {
		if (typeof callback === "function") {
			if (!userZZInfo) {
				window.setTimeout(function() {
					getUserZZInfo(callback)
				}, 30);
			} else {
				callback(userZZInfo);
			}
		}
	}

	exports.getUserInfo = getUserInfo;
	exports.getUserLogo = getUserLogo;
	exports.getUserZZInfo = getUserZZInfo;
});