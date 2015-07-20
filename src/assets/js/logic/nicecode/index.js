//默认靓号列表：/service/web/nicecode/index/codelist
//换一批YY靓号：/service/web/nicecode/index/randomImList
//换一批情侣靓号：/service/web/nicecode/index/randomLoversImList
//换一批频道号：/service/web/nicecode/index/randomSessionNumberList
//每日推荐：/service/web/nicecode/index/ranking
//靓号评估：/service/web/nicecode/evaluate
//我的购买信息：/service/web/nicecode/mine/info

define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");

	var Slide = require('../../aralejs/slide');
	var template = require("../../lib/template.min.js");
	var dialog = require("../../mod/dialog/dialog");
	require('../../mod/screenWatch');

	function slider() {
		slide = new Slide({
			element: '#slideS1',
			duration: 300,
			effect: 'scrollx',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers: true,

			activeTriggerClass: 'active'
		}).render();
	}


	require("./nicecodenav");

	require('../../mod/header');

	require('../../mod/nicecodeLoginSider');

	require('../../mod/ajaxhelper');


	var LoginInfo = require('../../mod/login');
	LoginInfo.getUserInfo(function(userinfo) {

		$('#loginArea').html(require('../../tpl/output/loginHder')(userinfo));
		if (userinfo && userinfo.data.info.vipUser) {
			myBuyInfo();
		}
	});

	var _mallTrend_adno1 = 40003; //商城动态广告１
	var _mallTrend_adno2 = 40002; //商城动态广告２
	var _slider_adno = 40001; //顶部轮播广告


	var _mallTrend_ad_tpl = '{{each list as v i}}{{if i < 3}}'　 +
		'<li><i>{{i+1}}</i><a href="{{v.url}}" target="_blank">{{v.desc}}</a></li>' +
		'{{/if}}{{/each}}';

	var _mallTrend_adimg_tpl = '<a href="{{list[0].url}}" target="_blank"><img src="{{list[0].images}}" alt="{{list[0].desc}}"/></a>';

	var _nicecode_rank_tpl = '{{each list as v i}}{{if i < 3}}'　 +
	'<li><i class="top-num__{{i+1}}">{{i+1}}</i><em></em><a href="http://vip.yy.com/vip/vmall2/detailpay?productId={{v.id}}" target="_blank">{{v.key}}</a></li>' +
		'{{/if}}{{/each}}';
	var _nicecode_ranklove_tpl = '{{each list as v i}}{{if i < 3}}'　 +
	'<li><i class="top-num__{{i+1}}">{{i+1}}</i><em></em><a href="http://vip.yy.com/vip/vmall2/detailpay?productId={{v.id}}" target="_blank">{{#v.m_key}}<br/>{{#v.s_key}}</a></li>' +
		'{{/if}}{{/each}}';


	var nicecodeConfig = [{
		serurl: '/service/web/nicecode/index/randomImList',
		tpl: 'tpl_ImList',
		targetObj: '#imListBox',
		changeFunc: getRandomNicecode0
	}, {
		//serurl: '/service/web/nicecode/index/randomImList',
		//tpl: 'tpl_ImList',
		serurl: '/service/web/nicecode/index/randomSessionNumberList',
		tpl: 'tpl_ChList',
		targetObj: '#chListBox',
		changeFunc: getRandomNicecode1
	}, {
		serurl: '/service/web/nicecode/index/randomLoversImList',
		tpl: 'tpl_LoversList',
		targetObj: '#loversListBox',
		changeFunc: getRandomNicecode2
	}]

	for (var i = 0; i < nicecodeConfig.length; i++) {
		var _cf = nicecodeConfig[i];
		getRandomNicecode(_cf);

		$(_cf.targetObj).on('click', '.btn-change', _cf.changeFunc);
	}

	function getRandomNicecode0() {
		getRandomNicecode(nicecodeConfig[0])
	};

	function getRandomNicecode1() {
		getRandomNicecode(nicecodeConfig[1])
	};

	function getRandomNicecode2() {
		getRandomNicecode(nicecodeConfig[2])
	};

	function getRandomNicecode(config) {
		$.ajax({
			url: config.serurl,
			dataType: 'json',
			context: {
				maskId: $(config.targetObj).find('.btn-change')
			},
			success: function(rsp) {
				if (rsp.result) {
					$(config.targetObj).html(template(config.tpl, rsp.data));
				}
			}
		});
	}



	//靓号排行榜
	$.ajax({
		url: '/service/web/nicecode/index/ranking',
		dataType: 'json',
		/*context: {
			maskId: $(config.targetObj)
		},*/
		success: function(rsp) {
			if (rsp.result) {
				$('#topImList').html(template.compile(_nicecode_rank_tpl)({
					list: rsp.data['recommendImList']
				}));
				$('#topChList').html(template.compile(_nicecode_rank_tpl)({
					list: rsp.data['recommendChannelList']
				}));
				$('#toploversListBox').html(template.compile(_nicecode_ranklove_tpl)({
					list: rsp.data['recommendLoverList']
				}));
			}
		}
	});



	//载入页面广告
	(function loadleft() {
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=" + _mallTrend_adno1 + "&adNo=" + _mallTrend_adno2 + "&adNo=" + _slider_adno,
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if (rsp.data) {
					if (rsp.data[_mallTrend_adno1]) {
						$('#mallTrendTop').html(template.compile(_mallTrend_ad_tpl)({
							list: rsp.data[_mallTrend_adno1]
						}));
					}
					if (rsp.data[_mallTrend_adno2]) {
						$('#mallTrendAxd').html(template.compile(_mallTrend_adimg_tpl)({
							list: rsp.data[_mallTrend_adno2]
						}));
					}
					if (rsp.data[_slider_adno]) {
						if (rsp.data[_slider_adno].length > 0) {
							$('#slideS1').html(template("tpl-mainslide", {
								list: rsp.data[_slider_adno]
							}));
							slider();
						}
					}
				}
			}
		});
	})();

	//我的购买信息
	function myBuyInfo() {
		$.ajax({
			url: "/service/web/nicecode/mine/info",
			type: 'GET',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.data) {

					/**********************/
					// console.log("----- 我的购买信息 -----");
					// console.log(rsp.data);
					/**********************/

					$('#myCouponSize').html(rsp.data.couponSize || 0)
					$('#myOrderSize').html(rsp.data.orderSize || 0)
				}
			}
		});
	}



	//评估回车直接进行搜索
	$('#iptEvaluate').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#btnEvaluate').click();
		}
	});

	//评估按钮事件
	$('#btnEvaluate').click(function() {
		var evaluateValue = $.trim($('#iptEvaluate').val());
		if (evaluateValue == "") {
			dialog.showMsgBox("评估号码不能为空");
			return false;
		}
		$.ajax({
			url: "/service/web/nicecode/evaluate",
			dataType: "json",
			type: "GET",
			cache: false,
			data: {
				imid: evaluateValue
			},
			success: function(rsp) {
				if (rsp["result"]) {
					var _tpl = '<div class="certificate"><span class="yy_imid">{{imid}}</span><span class="grade">{{grade}}</span><span class="price">{{price}}</span><span class="beat">{{beat}}</span></div>';
					var _html = template.compile(_tpl)(rsp.data);
					dialog({
						title: '温馨提示',
						content: _html,
						skin: "ui-dialog-skin-vip",
						lock: true,
						padding: "0"
					}).showModal();
				} else {
					dialog.showMsgBox(rsp.desc);
				}
			}
		});
	});

});