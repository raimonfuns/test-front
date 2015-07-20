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


	//页面的类型　链接参数　1-单号靓号;2-情侣靓号;3-频道靓号;21-靓号租赁
	var _NiceCodeType = 1;

	var r = window.location.search.substr(1).match(/(^|[&|?])type=([^&]*)(&|$)/);
	if (r != null) {
		_NiceCodeType = unescape(r[2]);
	}


	//号码搜索框模板
	var _tpl_textSearch = {
		'1': '<em>单号</em><span>靓号</span>',
		'2': '<em>情侣</em><span>靓号</span>',
		'3': '<em>频道</em><span>靓号</span>',
		'21': '<em>租赁</em><span>靓号</span>'
	};

	$('#filterTitle').replaceWith(template.compile(_tpl_textSearch[_NiceCodeType])({}));

	//号码搜索过虑条件
	$.ajax({
		url: '/service/web/nicecode/optoins',
		dataType: 'json',
		data: {
			"type": _NiceCodeType
		},
		success: function(rsp) {
			if (rsp.result) {

				$('#coderFilter').html(template('tpl_coldfilter', $.extend(rsp.data,{pagetype:_NiceCodeType})));
			}
		}
	});


	//按条件搜索
	var _searchParameter = {
		code: 0, //过滤条件id
		priceRangeCode: 0, //价格过滤条件id
		sizeCode: 0, // 位数条件id
		searchTxt: '', //搜索内容
		currentPage: 1 //当前页面
	};

	var _nicecodeConfig = {
		'1': {
			serurl: '/service/web/nicecode/yy/code/select?type=1',
			tpl: 'tpl_ImList',
			className: 'nicecode-list__N'
		},
		'2': {
			serurl: '/service/web/nicecode/yy/code/select?type=2',
			tpl: 'tpl_LoversList',
			className: 'nicecode-list__L'
		},
		'3': {
			serurl: '/service/web/nicecode/yy/code/select?type=3',
			tpl: 'tpl_ChList',
			className: 'nicecode-list__C'
		},
		'21': {
			serurl: '/service/web/nicecode/yy/code/select?type=21',
			tpl: 'tpl_ImListZL',
			className: 'nicecode-list__N'
		}
	}[_NiceCodeType];

	$('#coderFilter').on('click', 'a.j-select-size', function() {

		markSelectItem($(this), 'a.j-select-size', 'sizeCode');
	});

	$('#coderFilter').on('click', 'a.j-select-code', function() {
		markSelectItem($(this), 'a.j-select-code', 'code');
	});

	$('#coderFilter').on('click', 'a.j-select-prize', function() {
		markSelectItem($(this), 'a.j-select-prize', 'priceRangeCode');
	});

	function markSelectItem($obj, selector, searchCon, code) {
		if ($obj.hasClass('active') && $obj.data('code') != 0) {
			return;
		} else {
			$('#coderFilter').find(selector).removeClass('active');
			$obj.addClass('active');
			_searchParameter[searchCon] = $obj.data('code');
			_searchParameter.currentPage = 1;
			_searchParameter.searchTxt = '';
			getRandomNicecode(_nicecodeConfig);
			$('#textFilter').find('input').val('');
		}
	}

	$('#textFilter').on('click', 'a', function() {
		var _searchtext = $(this).prev('input').val();
		if (/^\d+$/.test(_searchtext)) {
			$('#coderFilter').find('a').removeClass('active');
			$('#coderFilter').find('a[data-code=0]').addClass('active');
			_searchParameter = {
				code: 0,
				priceRangeCode: 0,
				sizeCode: 0,
				searchTxt: _searchtext,
				currentPage: 1
			};
			getRandomNicecode(_nicecodeConfig);
		} else {
			dialog.showMsgBox('请输入正确的yy号');
		}
	});

	$('#textFilter input').keypress(function(event) {
		if (event.keyCode == 13) {
			$(this).siblings('a').trigger('click');
		}
	});


	//号码搜索结果列表



	$('#imListBox').addClass(_nicecodeConfig.className);



	var pagehelper = require('../../mod/pagehelper.js');

	var _totalPages = 1; //除了第一页，其它页此数据为0

	function getRandomNicecode(config) {

		$.ajax({
			url: _nicecodeConfig.serurl,
			dataType: 'json',
			data: _searchParameter,
			context: {
				maskId: $('#imListBox')
			},
			success: function(rsp) {
				if (rsp.result) {
					$('#imListBox').html(template(_nicecodeConfig.tpl, rsp.data));
					pagehelper.initPage('#pager', rsp.data, goToPage, _searchParameter);
					_totalPages = rsp.data.totalPages;
				}
			}
		});
	}
	getRandomNicecode(_nicecodeConfig);


	function goToPage(param) {
		$.ajax({
			async: true,
			cache: false,
			url: _nicecodeConfig.serurl,
			data: param,
			context: {
				maskId: 'pager'
			},
			dataType: "json",
			success: function(ret) {
				if (ret.result) {
					ret.data.totalPages = _totalPages;
					pagehelper.initPage('#pager', ret.data, goToPage, param);
					$('#imListBox').html(template(_nicecodeConfig.tpl, ret.data));

				}
			}
		});
	}


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



	//载入页面广告
	(function loadleft() {
		var _aNo1 = '40004'; //right side middle ad,
		var _aNo2 = '40005'; //right side float ad,

		var _mallTrend_adimg_tpl = '<a href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}" style="width:230px;height:150px;"/></a>';
		var _mallTrend_rfloat_tpl = '<div style="width: 260px;height: 320px;max-width: 183px;max-height: 228px;position: fixed;_position: absolute;top: 140px;right:0;text-align: center;"><a href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a></div>'
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=" + _aNo1 + "&adNo=" + _aNo2,
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if (rsp.data) {
					if (rsp.data[_aNo1]) {
						$('#mallTrendAxd').html(template.compile(_mallTrend_adimg_tpl)(rsp.data[_aNo1][0]));
					}
					if (rsp.data[_aNo2] && _NiceCodeType == 1) {
						$('body').append(template.compile(_mallTrend_rfloat_tpl)(rsp.data[_aNo2][0]));
					}
				}
			}
		});
	})();


	//靓号购买说明
	var _rule_content = ''
	if (_NiceCodeType == 1 || _NiceCodeType == 2) {
		_rule_content = '<ul class="rules-detail">' + '	<li><span>会员和普通用户都可以购买YY靓号</span></li>' + '	<li><span>买YY靓号送3个月会员，客户端会显示YY靓号图标，当购买YY靓号超过一定金额时，会获得YY土豪靓号图标</span></li>' + '	<li><span>购买单号靓号的用户，所购买的靓号需手动绑定在购买时使用的账号上，不可转移绑定在其它账号上</span></li>' + '	<li><span>成功购买YY靓号后，请在30天内完成绑定，如逾期未完成绑定，YY会员将有权回收该靓号且不退款</span></li>' + '	<li><span>拥有YY靓号需要一直保持YY会员身份，如使用YY靓号过程中YY会员过期，且超过30天未续费，该YY靓号将会将被系统回收</span></li>' + '	<li><span>情侣靓号的其中一个号码默认绑定在购买时使用的账号上，另一个号码绑定在手动输入的YY号上</span></li>' + '	<li><span>购买情侣靓号需要遵守以上规定，如有一个号码没有满足以上规定，则两个靓号将一起被系统回收</span></li>' + '</ul>'
	} else if (_NiceCodeType == 21) {
		_rule_content = '<ul class="rules-detail"><li>租赁到期时间内，号码拥有者，可优先续租，在我的购买中进行操作</li>' + '<li>租赁日从付款购买当天算起，租赁到期后，即系统收回租赁的号码</li>' + '<li>租赁的号码，不再赠送YY会员，且不再需要与会员身份绑定，会员过期不会回收租赁的号码</li>' + '<li>租赁靓号的用户，所租赁的靓号需手动绑定在购买时使用的账号上，不可转移绑定在其它账号上</li>' + '<li>若租赁号码在租赁期内，用户自行更换号码，被更换号码也为用户保留对应租赁的时长，若用户号码被回收，租赁期也未满，则回到租赁的号码若租赁期已满，则回收该号码</li>' + '</ul>'
		$('#buyRules').html('租赁购买说明»');
	} else {
		_rule_content = '<ul class="rules-detail">' + '	<li><span>YY用户均可购买频道靓号。购买成功后会赠送您3张加油金卡，系统会在靓号激活后为您自动使用。</span></li>' + '	<li><span>购买靓号后，用户可把靓号覆盖到购买账号已拥有的频道号上，原始频道的积分、等级等，均能移植到频道靓号上。靓号不能转移到其他YY账号下。</span></li>' + '	<li><span style="color:red;">原始频道必须先完成频道类型认证，才能激活频道靓号。<a href="https://hao.yy.com/owauth/authDefault" target="_blank">完成频道认证</a></span></li>' + '	<li><span>频道靓号购买后，需按相关的考核标准参与考核。<a href="http://vip.yy.com/vip/nicecode/channelrule" target="_blank">详细说明</a></span></li>' + '	<li><span>购买靓号时，需在30分钟内完成支付；逾期未完成支付的号码，将重新上架到商城。</span></li>' + '	<li><span>成功购买频道靓号后，30天内需在会员<a href="http://vip.yy.com/vip/nicecode/mine" target="_blank">靓号商城-我的购买</a>中完成激活。否则靓号商城有权回收靓号，余额不退。</span></li>' + '</ul>'
	}

	$('#buyRules').on('click', function() {
		dialog.showMsgBox(_rule_content);
	});



});