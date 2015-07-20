define(function(require, exports, module) {
	var $ = jQuery = require("../lib/jquery.min.js");
	//var Carousel = require('../aralejs/accordion');
	//var Carousel = require('../aralejs/carousel');
	var Slide = require('../aralejs/slide');
	var cookie = require("../mod/jquery.cookie.js");
	require("../mod/taskyyie.js");
    var edt = require("../mod/edt.js");
	var ie = getIEVersion(),
		$slideS1 = $('#slideS1'),
		slide,
		screenStatic,
		timer = null;
 
	function slider() {
		slide = new Slide({
			element: '#slideS1',
			duration: 300,
			effect: 'scrollx', 
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers: true,
			triggers: ".ui-switchable-trigger",
			activeTriggerClass: 'active'
		}).render();
	}

	

	//slider();
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
		//脚本设置滚动广告的导航宽度
		var lis = $("#slideS1 .ui-switchable-nav li");
		var navLength = $("#slideS1 .ui-switchable-nav li").length;
		var hideNavLength = $("#slideS1 .ui-switchable-nav").find("li[data-edit-show]").length;
		navLength = navLength-hideNavLength;
		var	totalWidth = $("#slideS1").width();
		$("#slideS1 .ui-switchable-nav").width(totalWidth + 1).show();
		$("#slideS1 .ui-switchable-nav li").width((totalWidth + 1 - navLength * 1) / navLength);
		//IE8以下窄屏适配
		if (ie !== -1 && ie < 9) {
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

			if (slide && slide !== null) {
				slide.destroy();

				//重置slider
				$slideS1.find(".slide__trigger").removeClass("active");
				slider();
				slide.switchTo(0);
			} else {
				slider();
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


	require('../mod/header');

	require('../mod/loginSider');

	require('../mod/ajaxhelper');

	/**********
	 *取靓号
	 *********/
	var template = require('../lib/template.min.js');

	function getNiceCode() {
		$.ajax({
			url: "/service/web/nicecode/yy/code/boutique?size=3",
			type: 'GET',
			cache: false,
			dataType: 'json',
			context: {
				maskId: 'getNiceCode'
			},
			success: function(rsp) {
				if (rsp.result) {

					/**************************/
					console.log('----- 靓号数据 -----')
					console.log(rsp.data);
					/**************************/

					$('#niceCodeBox').html(template('tplNiceCode', rsp.data));
				}
			}
		});
	};
	
	// 要触发一次点击事件
	$('#getNiceCode').on('click', getNiceCode).trigger('click');

	var LoginInfo = require('../mod/login');
	LoginInfo.getUserInfo(function(userinfo) {
		console.log('********* userinfo **********');
		console.log(userinfo);
		if (userinfo.result && userinfo.data.info.vipUser) {
			$('#recommenTop').show(); // 显示会员特权模块
		} else {
			$('#recommenBottom').show(); // 显示普通会员
		}
	
		$('#activityBox').find('a').each(function(i, e) {
			if (userinfo.data.serverTime < $(e).data('starttime')) {
				if ($(e).hasClass('pic-list__btn')) {
					$(e).addClass('pic-list__btn--disable').html('即将开始');
				}
			} else {
				var _u = $(e).data('url') || '';
				if (_u != '') {
					$(e).click(function() {
						window.open(_u, '_blank')
					});
				} else {
					$(e).click(function() {
						window.open('/p/activity/index.html', '_blank')
					});
				}
				if ($(e).hasClass('pic-list__btn')) {
					$(e).addClass('pic-list__btn--join').html('马上参与');
				}
			}
		});
	});

	//http://vip.yy.com/vip/vmall2/detailpay?productId=2489

	//如果地址带src=zmb，加上yy导航栏 
	/*function GetQueryString(name)
	{
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	if(GetQueryString("src") == "zmb"){
		var scriptBlock=document.createElement("script");
	     scriptBlock.src="http://res.yy.com/common/js/navbar/navbar.js?id=vip";
	    document.getElementsByTagName("head")[0].appendChild(scriptBlock);
	}*/

	//检查福利社是否有新的物品上架
	//VIP_WELFARE_EXP
	//VIP_WELFARE_KICK
	var cookieExp = 'VIP_WELFARE_EXP',
		cookieKick = 'VIP_WELFARE_KICK';
	$.ajax({
		url: '/service/web/welfare/hasNewProduct',
		cache: false,
		dataType: 'json',
		success: function(rsp) {
			if (rsp.result) {
				//有新商品上架
				var cookieExpVal = $.cookie(cookieExp),
					cookieKickVal = $.cookie(cookieKick);

				/**************************/
				console.log('----- cookieExpVal -----')
				console.log(cookieExpVal);
				console.log('----- cookieKickVal -----')
				console.log(cookieKickVal);
				console.log('----- 福利社是否有新上架数据 -----')
				console.log(rsp.data);
				/**************************/

				if (cookieExpVal == undefined || cookieExpVal < rsp.data) {
					$.cookie(cookieExp, rsp.data);
					$.cookie(cookieKick, 0);
					//显示福利社new标签
					$(".task-list__link--01_sign").show().css("display", "inline-block");
				} else {
					if (cookieKickVal == undefined || cookieKickVal != 1) {
						$(".task-list__link--01_sign").show().css("display", "inline-block");
					}
				}
			}
		}
	});
	$(".task-list__link--01").click(function() {
		if ($.cookie(cookieKick) == undefined || $.cookie(cookieKick) == 0) {
			$(".task-list__link--01_sign").hide();
		};
		$.cookie(cookieKick, 1);

	});
	
	//注册对应的广告初始化完成回调
	edt.regist([{pid:1,nullRemove:true,complete:function(pid,obj){
			
			 if(obj){
				 var li_switchable = '<li class="ui-switchable-trigger">'+obj.content+'</li>';
				
				 $(".ui-switchable-nav").append(li_switchable);
			 }
			 slide.destroy();
			 slide = null;
			 screenStatic = null;

			 screenWatch();
	}}]);
	edt.init();
	
	
	var _adNo_1 = '10401'; //左侧信息文字广告
		var _adNo_2 = '10210'; //左侧信息图片广告	230X110


		//载入左边的广告index-left-adv1
		;(function loadLeft(){
			$.ajax({
				url: "http://vip.yy.com/vip/ads?adNo=" + _adNo_1+ "&adNo=" + _adNo_2,
				type: 'GET',
				cache: false,
				dataType: 'jsonp',
				success: function(rsp) {
					if(rsp.data[_adNo_1] != null){
						$("#rightAdView1").html('<a href="'+rsp.data[_adNo_1][0].url+'" target="_blank">'+rsp.data[_adNo_1][0].desc+'</a>');
					}

					if(rsp.data[_adNo_2] != null){
						$('#rightAdView2').html('<a href="'+rsp.data[_adNo_2][0].url+'" target="_blank"><img src="'+rsp.data[_adNo_2][0].images+'" alt="'+rsp.data[_adNo_2][0].desc+'" ></a>');
					}
				}
			});
		})();

	//客服入口
	var $thisValue = "";
	window.searchResultList = function(rsp){
		if(!rsp.dataList || rsp.dataList.length <= 0){
			$(".kfsearch_mentions").hide();
		}
		else{
			var _html = "";
			for(var i = 0; i<rsp.dataList.length; i++){
				rsp.dataList[i].title = rsp.dataList[i].title.replace(new RegExp($thisValue, 'gm'),"<em>"+$thisValue+"</em>");
				_html += "<li><a href='http://kf.yy.com/search/qa/"+rsp.dataList[i].id+".html' target='_blank' title='"+rsp.dataList[i].title+"'>"+rsp.dataList[i].title+"</a></li>";
			}
			$(".kfsearch_mentions").html(_html).show();
		}
	}
	function gotoKFPage(){
		_hmt.push(['_trackPageview', "/index/kf-search-count"]);
		if($.trim($thisValue)){
			window.open("http://kf.yy.com/search/#="+$thisValue,"_blank");
		}
	}
	$("#kfsearch_input").bind('input propertychange',function(){
		$thisValue = $(this).val();
		if($thisValue){
			$.getScript("http://kf.yy.com/openSearchKM/?count=5&searchKey="+$(this).val()+"&callback=searchResultList&dataType=jsonp");
		}
		else{
			$(".kfsearch_mentions").hide();
		}
	}).bind('keypress',function(event){
        if(event.keyCode == "13")    
        {
            gotoKFPage();
        }
    });
	$(".kfsearch_input_wrap a").click(gotoKFPage);

	//客服统计
	$("body").delegate("[data-bdtj]","click",function(){
		_hmt.push(['_trackPageview', $(this).data("bdtj")]);
	});
});