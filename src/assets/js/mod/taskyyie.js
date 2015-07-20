define(function(require, exports, module) {
	var $ = jQuery = require("../lib/jquery.min.js");
	var cookie = require("../mod/jquery.cookie.js")
	var LoginInfo = require('./login');

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(val) {
			var value = this;
			for (var i = 0; i < value.length; i++) {
				if (value[i] == val) return i;
			}
			return -1;
		};
	}

	/***********************执行任务***********************************/
	
	var key1 = "fromYYie";
	var urlMap = LoginInfo.getMapFromURlParams();
	var hurl = window.location.href;
	var actId = 187;
	var taskId = 862;


	if (urlMap) {
		for (var s in urlMap) {
			doKeyTask(s, urlMap[s]);
		}
	}

	function doKeyTask(key, value) {
		if (key == key1) {
			doKey1(key, value);
		}

	}

	function doKey1(key, value) {
		LoginInfo.getUserInfo(function(userinfo) {

			if (userinfo && userinfo.result) {
				$.ajax({
					url: "http://task2.game.yy.com/task/finishTask.do?actId=" + actId + "&taskId=" + taskId,
					type: 'GET',
					async: true,
					cache: false,
					dataType: 'jsonp',
					success: function(rsp) {

					}
				});
			}
		});
	}
});