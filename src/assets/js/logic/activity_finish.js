define(function(require, exports, module) {

		var $ = jQuery = require("../lib/jquery.min.js");
	//var Carousel = require('../aralejs/accordion');
	//var Carousel = require('../aralejs/carousel');
	var Slide = require('../aralejs/slide');
	require('../mod/date');

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
		if (ie < 9) {
			if (W < 1200) {
				$("body").removeClass("screen-wide");
			} else {
				$("body").addClass("screen-wide");
			}
		}

		slideWatch();

	}

	// 宽窄屏监控
	function slideWatch() {
		var width = $(window).width(),
			currentScreenStatic;

		currentScreenStatic = width < 1200 ? 'narrow' : 'wide';

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


	var template = require("../lib/template.min");
	var ScrollToTriggle = require("../mod/scrolltotriggle");
	
	template.helper("$dataFormat", function(content){
		return new Date(content).format('yyyy-mm-dd');
	});
	
	//取得已经关闭的活动列表
	var ActivityShowObj = {
		_isEmpty_: false,
		_length_: 8,
		_current_: 0,
		_$container_: $("#rpl-finishactivity"),
		_$loading_: $("#rpl-activityloading"),
		_isAjax_: false,
		_type_: 2,
		get: function(){
			var self = this;
			//已经开始了一个ajax	
			if(self._isAjax_){
				return false;
			}
			self._isAjax_ = true;
			//已经没有“活动例表”了
			if(self._isEmpty_){
				return false;
			}
			//取得“活动列表”
			self._$loading_.show();
			self._current_ = self._current_ + 1;
			$.ajax({
				url: "/service/web/activitycenter/page",
				type: "GET",
				dataType: "json",
				cache: false,
				data: {pageno: self._current_, pagesize: self._length_, type: self._type_},
				success: function(rsp){
					var data = rsp.data;
					self._isAjax_ = false;
					if(data !== null){
						if(data.list.length == 0){
							self._isEmpty_ = true;
						}			
						self._$container_.append(template("tpl-activity", data));
					}
				},
				complete: function(){
					self._$loading_.hide();
				}
			});
		}
	};
	
	//滚动时加载列表
	ScrollToTriggle.addAction(function(){
		if(this.toBottom < 200 && this.toBottom > 100 && this.directive == "down"){
			ActivityShowObj.get();
		}
	});
	
	//初始化加载
	$(document).ready(function(){
		ActivityShowObj.get();
		require('../mod/header');
		require('../mod/loginSider');
	});
});