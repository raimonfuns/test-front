define(function(require, exports, module) {

	var $ = jQuery = require("../lib/jquery.min.js");
	//var Carousel = require('../aralejs/accordion');
	//var Carousel = require('../aralejs/carousel');
	var edt = require("../mod/edt.js");
	var Slide = require('../aralejs/slide');

	require('../mod/date');
	var ie = getIEVersion(),
		$slideS1 = $('#rpl-mainslide'),
		slide,
		screenStatic = $(window).width() < 1200 ? 'narrow' : 'wide',
		timer = null;

	function slider() {
		slide = new Slide({
			element: '#rpl-mainslide',
			duration: 300,
			effect: 'scrollx',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers:false,
			triggers: ".ui-switchable-trigger",
			activeTriggerClass: 'active'
		}).render();
	}



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

		if (currentScreenStatic !== screenStatic) {
			screenStatic = currentScreenStatic;
			//销毁slider
			if (slide !== null) {
				slide.destroy();

				//重置slider
				$slideS1.find(".slide__trigger").removeClass("active");
				slider();
				slide.switchTo(0);
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



	var Carousel = require("../aralejs/carousel");
	var Slide = require("../aralejs/slide");
	var template = require("../lib/template.min");
	var ScrollToTriggle = require("../mod/scrolltotriggle");

	template.helper("$dataFormat", function(content) {
		return new Date(content).format('yyyy-mm-dd');
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
		get: function() {
			var self = this;
			//已经开始了一个ajax	
			if (self._isAjax_) {
				return false;
			}
			self._isAjax_ = true;

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
				data: {
					pageno: self._current_,
					pagesize: self._length_,
					type: self._type_
				},
				success: function(rsp) {
					var data = rsp.data;
					self._isAjax_ = false;
					if (data !== null) {	
						if(data.list.length == 0){
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

	//广告滚动bar对象
	var adScrollBarObj = {
		_loadingClass_: "slide-s3loading",
		_$container_: $("#rpl-mainslide"),
		get: function() {
			var self = this;
			self._$container_.addClass("slide-s3loading");
			$.ajax({
				url: "http://vip.yy.com/vip/ads",
				type: "GET",
				dataType: "jsonp",
				cache: false,
				data: {
					adNo: 10208
				},
				success: function(rsp) {
					var data = rsp.data;
					self._$container_.append(template("tpl-mainslide", {
						list: rsp.data
					}));
					slider();
					edt.init();
				},
				complete: function() {
					self._$container_.removeClass("slide-s3loading");
				}
			});
		}
	};

	adScrollBarObj.get();

	//滚动时加载列表
	ScrollToTriggle.addAction(function() {

		if (this.toBottom < 200 && this.toBottom > 100 && this.directive == "down") {
			ActivityShowObj.get();
		}
	});

	//初始化加载
	$(document).ready(function() {
		ActivityShowObj.get();
		require('../mod/header');
		require('../mod/loginSider');
	});

	//注册对应的广告初始化完成回调
	edt.regist([{pid:7,nullRemove:true,complete:function(pid,obj){
			 if(obj){
				 var li_switchable = '<li class="ui-switchable-trigger">99</li>';
				
				 $(".ui-switchable-nav").append(li_switchable);
			 }
		 	 slide.destroy();
			 slide = null;
			 screenStatic = null;
			 screenWatch();
			 slider();
	}}]);
});