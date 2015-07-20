define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");

	var template = require("../../lib/template.min.js");
	var dialog = require("../../mod/dialog/dialog");
	require('../../mod/screenWatch');
	require('../../mod/header');
	require('../../mod/ajaxhelper');
	require("./nicecodenav");

	var LoginInfo = require('../../mod/login');
	LoginInfo.getUserInfo(function(userinfo) {
		if (userinfo && userinfo.data && userinfo.data.info && userinfo.data.info.vipUser) {}
	});


	//页面的类型　链接参数　1-单号靓号;2-频道靓号;
	var _NiceCodeType = 1,
		_currentConfig;

	var r = window.location.search.substr(1).match(/(^|[&|?])type=([^&]*)(&|$)/);
	if (r != null) {
		_NiceCodeType = unescape(r[2]);
	}



	//按条件搜索
	var _searchParameter = {
		code: 0, //过滤条件id
		priceRangeCode: 0, //价格过滤条件id
		sizeCode: 0, // 位数条件id
		searchTxt: '', //搜索内容
		currentPage: 1 //当前页面
	};

	var _nicecodeConfig = [{
		serurl: '/service/web/nicecode/yy/code/select?type=1',
		tpl: 'tpl_ImList',
		className: 'nicecode-list__N'
	}, {
		serurl: '/service/web/nicecode/yy/code/select?type=3',
		tpl: 'tpl_ChList',
		className: 'nicecode-list__C'
	}];


	$('#searchBtn').on('click', function() {
		var _searchtext = $(this).prev('input').val();
		if (/^\d+$/.test(_searchtext)) {

			$.extend(_searchParameter, {
				searchTxt: _searchtext,
				currentPage: 1
			});
			getRandomNicecode(_currentConfig);
		} else {
			dialog.showMsgBox('请输入正确的靓号');
		}
	});

	$('#searchTxt').keypress(function(event) {
		if (event.keyCode == 13) {
			$(this).siblings('a').trigger('click');
		}
	});


	//号码搜索结果列表


	var pagehelper = require('../../mod/pagehelper.js');

	var _totalPages = 1; //除了第一页，其它页此数据为0

	function getRandomNicecode(config) {

		$.ajax({
			url: _currentConfig.serurl,
			dataType: 'json',
			data: _searchParameter,
			context: {
				maskId: $('#searchBtn')
			},
			success: function(rsp) {
				if (rsp.result) {
					$('#imListBox').html(template(_currentConfig.tpl, rsp.data));
					pagehelper.initPage('#pager', rsp.data, goToPage, _searchParameter);
					_totalPages = rsp.data.totalPages;
				}
			}
		});
	}


	function goToPage(param) {
		$.ajax({
			async: true,
			cache: false,
			url: _currentConfig.serurl,
			data: param,
			context: {
				maskId: 'pager'
			},
			dataType: "json",
			success: function(ret) {
				if (ret.result) {
					ret.data.totalPages = _totalPages;
					pagehelper.initPage('#pager', ret.data, goToPage, param);
					$('#imListBox').html(template(_currentConfig.tpl, ret.data));

				}
			}
		});
	}

	$('#customNav').on('click', 'a', function() {
		if ($(this).hasClass('active')) {
			return;
		}
		var _type = $(this).data('type');
		$('#searchTxt').val('');
		$('#rule' + _type).show().siblings('.custom-search-rule').hide();
		$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
		_currentConfig = _nicecodeConfig[_type - 1];
		$('#imListBox').removeClass().addClass('nicecode-list ' + _currentConfig.className);
		$('#imListBox').html('');

	}).find('a[data-type=' + _NiceCodeType + ']').trigger('click');


	//载入页面广告
	(function loadleft() {
		var _mallTrend_adimg_tpl = '<a href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}" style="width:230px;height:150px;"/></a>';
		$.ajax({
			url: "http://vip.yy.com/vip/ad?adNo=40004",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if (rsp.data) {
					$('#mallTrendAxd').html(template.compile(_mallTrend_adimg_tpl)(rsp.data));
				}
			}
		});
	})();


	//靓号购买说明


	$('#buyRules').on('click', function() {
		var _rule_content = '';

		if (_currentConfig.tpl == 'tpl_ImList') {
			_rule_content = '<ul class="rules-detail">' + '	<li><span>会员和普通用户都可以购买YY靓号</span></li>' + '	<li><span>买YY靓号送3个月会员，客户端会显示YY靓号图标，当购买YY靓号超过一定金额时，会获得YY土豪靓号图标</span></li>' + '	<li><span>购买单号靓号的用户，所购买的靓号需手动绑定在购买时使用的账号上，不可转移绑定在其它账号上</span></li>' + '	<li><span>成功购买YY靓号后，请在30天内完成绑定，如逾期未完成绑定，YY会员将有权回收该靓号且不退款</span></li>' + '	<li><span>拥有YY靓号需要一直保持YY会员身份，如使用YY靓号过程中YY会员过期，且超过30天未续费，该YY靓号将会将被系统回收</span></li>' + '	<li><span>情侣靓号的其中一个号码默认绑定在购买时使用的账号上，另一个号码绑定在手动输入的YY号上,绑定的YY号需是好友关系</span></li>' + '	<li><span>购买情侣靓号需要遵守以上规定，如有一个号码没有满足以上规定，则两个靓号将一起被系统回收</span></li>' + '</ul>'
		} else {
			_rule_content = '<ul class="rules-detail">' + '	<li><span>YY用户均可购买频道靓号。购买成功后会赠送您3张加油金卡，系统会在靓号激活后为您自动使用。</span></li>' + '	<li><span>购买靓号后，用户可把靓号覆盖到购买账号已拥有的频道号上，原始频道的积分、等级等，均能移植到频道靓号上。靓号不能转移到其他YY账号下。</span></li>' + '	<li><span style="color:red;">原始频道必须先完成频道类型认证，才能激活频道靓号。<a href="https://hao.yy.com/owauth/authDefault" target="_blank">完成频道认证</a></span></li>' + '	<li><span>频道靓号购买后，需按相关的考核标准参与考核。<a href="http://vip.yy.com/vip/nicecode/channelrule" target="_blank">详细说明</a></span></li>' + '	<li><span>购买靓号时，需在30分钟内完成支付；逾期未完成支付的号码，将重新上架到商城。</span></li>' + '	<li><span>成功购买频道靓号后，30天内需在会员<a href="http://vip.yy.com/vip/nicecode/mine" target="_blank">靓号商城-我的购买</a>中完成激活。否则靓号商城有权回收靓号，余额不退。</span></li>' + '</ul>'
		}
		dialog.showMsgBox(_rule_content);
	});

    //土豪靓号推荐
	function getNiceCode() {
		$.ajax({
			url: "/service/web/nicecode/yy/code/boutique?size=4",
			type: 'GET',
			cache: false,
			dataType: 'json',
			context: {
				maskId: 'getNiceCode'
			},
			success: function(rsp) {
				if (rsp.result) {
					$('#niceCodeBox').html(template('tplNiceCode', rsp.data));
				}
			}
		});
	}

	$('#getNiceCode').on('click', getNiceCode).trigger('click');

	//今日靓号推荐
	(function getNiceLowCode() {
		$.ajax({
			url: "/service/web/nicecode/yy/code/boutique?size=2",
			type: 'GET',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result) {
					$('#niceCodeLowBox').html(template('tplNiceCode', rsp.data));
				}
			}
		});
	})();


});