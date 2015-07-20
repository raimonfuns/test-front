define(function(require, exports, module) {

	var $ = jQuery = require("../../lib/jquery.min.js");

	require('../../mod/screenWatch');

	require('../../mod/date');
	require('../../mod/header');
	require('../../mod/nicecodeLoginSider');
	require('../../mod/ajaxhelper');


	var template = require("../../lib/template.min");
	var ScrollToTriggle = require("../../mod/scrolltotriggle");

	template.helper("$dataFormat", function(content) {
		return new Date(content).format('yyyy-mm-dd');
	});

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

	//取得正在开启的活动列表对象
	var ActivityShowObj = {
		_isEmpty_: false,
		_length_: 8,
		_current_: 0,
		_$container_: $("#rpl-activity"),
		_$loading_: $("#rpl-activityloading"),
		_isAjax_: false,
		_type_: 1,
		_total_:0,
		get: function() {
			var self = this;
			//已经开始了一个ajax	
			if (self._isAjax_) {
				return false;
			}
			self._isAjax_ = true;

			if (self._isEmpty_) {
				return false;
			}

			//取得“活动列表”
			self._$loading_.show();
			self._current_ = self._current_ + 1;
			$.ajax({
				url: "/service/web/activitycenter/getActByTypeNop",
				type: "GET",
				dataType: "json",
				cache: false,
				data: {
					pageno: self._current_,
					pagesize: self._length_,
					act_type:5,
					type: window.activityType
				},
				success: function(rsp) {
					var data = rsp.data;
					self._isAjax_ = false;
					self._total_ = rsp.data.totalPage;
					if (data !== null) {
						if (data.list.length == 0) {
							self._isEmpty_ = true;
						}
						self._$container_.append(template("tpl-activity", data));
					}
				},
				complete: function() {
					self._$loading_.hide();
				}
			});
		}
	};



	//滚动时加载列表
	ScrollToTriggle.addAction(function() {

		if (this.toBottom < 200 && this.toBottom > 100 && this.directive == "down") {
			if(ActivityShowObj._current_ < ActivityShowObj._total_){
				ActivityShowObj.get();
			}
		}
	});

	//初始化加载
	$(document).ready(function() {
		ActivityShowObj.get();
	});

	var LoginInfo = require('../../mod/login');
	LoginInfo.getUserInfo(function(userinfo) {
		if (userinfo && userinfo.data.info && userinfo.data.info.vipUser) {
			myBuyInfo();
		}
	});

	//我的购买信息
	function myBuyInfo() {
		$.ajax({
			url: "/service/web/nicecode/mine/info",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {				
				if (rsp.data) {
					$('#myCouponSize').html(rsp.data.couponSize);
					$('#myOrderSize').html(rsp.data.orderSize);
				}
			}
		});
	}

	var _currentCodeBox = 'niceCodeBox1';
	var _nicecodeConfig = {'niceCodeBox1': {url:'/service/web/nicecode/index/randomImList',dataname:'yyImList',tpl:'tplNiceCode1'},
		'niceCodeBox2':{url:'/service/web/nicecode/index/randomSessionNumberList',dataname:'channelIdList',tpl:'tplNiceCode2'},
		'niceCodeBox3':{url:'/service/web/nicecode/index/randomLoversImList',dataname:'loversImList',tpl:'tplNiceCode3'}};

	function getNiceCode() {
		var _url = _nicecodeConfig[_currentCodeBox].url;
		$.ajax({
			url: _url,
			type: 'GET',
			cache: false,
			dataType: 'json',
			context: {
				maskId: $('#getNiceCode')
			},
			success: function(rsp) {
				if (rsp.result) {
					$('#' + _currentCodeBox).html(template(_nicecodeConfig[_currentCodeBox].tpl, {hotCodes:rsp.data[_nicecodeConfig[_currentCodeBox].dataname]}));
				}
			}
		});
	};

	$('#recommendNav').on('mouseenter','a',function(i){
		$(this).addClass('activity').siblings('a').removeClass('activity');
		_currentCodeBox = $(this).data('targetbox');
		var $target = $('#' + $(this).data('targetbox'));
		$target.show().siblings().hide();
		$('#moreLink').prop('href',$(this).data('morelink'));
		if($('#' + _currentCodeBox).html() == ''){
			getNiceCode();
		}
	})

	$('#getNiceCode').on('click',getNiceCode).trigger('click');
});