define(function(require, exports, module) {

// 实现功能
// 1.菜单栏项高亮
// 2.用户信息显示

	function getHostRelative(url) {
		var host = "null";
		if (typeof url == "undefined" || null == url) url = window.location.href;
		var regex = /.*\:\/\/([^\/]*).*/;
		var match = url.match(regex);
		if (typeof match != "undefined" && null != match) host = match[1];
		return url.substring(url.indexOf(host) + host.length);
	}

	// 每个页面对应的菜单栏项高亮
	$('.vip-header__menu').find('a').each(function(i, e) {
		var _u = getHostRelative();

		/**************************/
		// console.log('---- getHostRelative ----');
		// console.log(_u);
		// console.log('---- $(e).attr(href) ----')
		// console.log($(e).attr('href'));
		/**************************/

		if ($(e).attr('href') == '/') { //如果是首页
			if (_u.substring(1, 2) == '' || _u.substring(1, 2) == '?' || _u.substring(1, 2) == '#') {
				$(e).parent('li').addClass('current');
			}
		} else if (_u.indexOf($(e).attr('href')) == 0) { //比较相对地址和a标签的href
			$(e).parent('li').addClass('current');
			return false;
		} else {
			var attr = $(e).attr('alllink');
			if (attr) {
				var as = attr.split('|');
				for (var j = 0; j < as.length; j++) {
					if (_u.indexOf(as[j]) >= 0) {
						$(e).parent('li').addClass('current');
						return false;
					}
				}
			}
		}
	});
	var LoginInfo = require('./login');
	var MyInfo = require('./myinfo');
	LoginInfo.getUserInfo(function(userinfo) {
		$('#loginArea').html(require('../tpl/public/loginHder')({userinfo}));

		/**************************/
		// console.log('----- 用户数据 -----')
		// console.log(userinfo);
		/**************************/

		//登陆后获取最新消息
		if(userinfo && userinfo.result)
		{
			setTimeout(MyInfo.startCheck,50);
			if (typeof completeHeaderCallBack === "function")
			{
				completeHeaderCallBack();
			}
		}
		
	});
	var completeHeaderCallBack;
	function completeHeader(value){
		completeHeaderCallBack = value;
	}
	exports.completeHeader = completeHeader;
});