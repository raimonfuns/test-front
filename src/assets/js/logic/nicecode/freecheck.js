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
	var _nicecodeConfig = [{
		type: '1',
		contaner: 'codeList',
		tpl: 'tplCodeList'

	}, {
		type: '2',
		contaner: 'othercodelist',
		tpl: 'tplOthercodelist'

	}, {
		type: '3'
	}];

	var pagehelper = require('../../mod/pagehelper.js');
	var codeDatas;
	function getCodeList(config) {

		if (config.type == "1" && (!codeDatas || codeDatas.length == 0)) {
			$.ajax({
				url: "/service/web/nicecode/freecheck/load/code",
				dataType: 'json',
				success: function(rsp) {
					codeDatas = [];
					if (rsp["result"]) {
						if (rsp["data"]["fcheckcode"]) {
							codeDatas  = rsp["data"]["fcheckcode"]["codelist"];
						}
					}
					codeDatas = codeDatas == undefined ? [] : codeDatas;
					$('#' + config.contaner).html(template(config.tpl, {
						datas: codeDatas
					}));

				}
			});
		}

	}

	$("#orderlist").delegate("#buyCheckBtn", "click", function() {

		var $this = $(this);
		var $tips = $this.siblings("h3[data-type=errorTip]");
		var $input = $this.siblings("input[type=text]");
		var value = $.trim($input.val());
		$tips.hide();
		var shortIdValue = value;
		if (!shortIdValue || shortIdValue.length == 0) {
			//$tips.text("输入的频道号不能为空的！").show();
			dialog.showMsgBox("输入的频道号不能为空的！");
		} else if (/^[0-9]+$/.test(shortIdValue)) {
			$.ajax({
				type: "post",
				dataType: "json",
				url: "/service/web/nicecode/checkScoreInfo",
				data: {
					asid: shortIdValue
				},
				async: true,
				cache: false,
				context: {
					maskId: $this
				},
				success: function(rsp) {
					if (rsp["result"]) {

						var datas = rsp["data"]["fcheckcode"]["codelist"];
						$('#' + _nicecodeConfig[1].contaner).show();
						$('#' + _nicecodeConfig[1].contaner).html(template(_nicecodeConfig[1].tpl, {
							datas: datas
						}));

					} else {
						$('#' + _nicecodeConfig[1].contaner).html("");

						if (rsp.code == 1000) {
							showUdbLogin();
						} else {
							$input.val("");
							dialog.showMsgBox(rsp["desc"]);
						}
					}
				}
			});
		} else {
			dialog.showMsgBox("输入的频道号含有非法字符。");
		}

	});


	//为“尝试复活”按钮增加“click”事件动作
	$("#orderlist").delegate("#livecheckBtn", "click", function() {
		var $this = $(this);
		var $tips = $this.siblings("h3[data-type=errorTip]");
		var $input = $this.siblings("input[type=text]");
		var value = $.trim($input.val());
		$tips.hide();
		if (value == "输入原频道号码" || value.length == 0) {
			//$tips.text("原频道号不能为空的！").show();
			dialog.showMsgBox("原频道号不能为空的！");
			return false;
		}
		if (!(/^\d+$/.test(value))) {
			//$tips.text("原频道号只能为数字！").show();
			dialog.showMsgBox("原频道号只能为数字！");
			return false;
		}
		$.ajax({
			type: "post",
			dataType: "json",
			url: "/service/web/nicecode/rebind/owCheck",
			data: {
				sid: value
			},
			async: true,
			cache: false,
			context: {
				maskId: $this
			},
			success: function(rsp) {
				if (rsp["result"]) {
					if (rsp.data.status == 1) {
						dialog({
							title: "操作信息",
							content: "复活的频道长位号：" + rsp.data.sid + "将会重新绑定到频道短位号：" + rsp.data.asidInfoList[0].asid + "， 确定要复活该频道长位号吗？",
							padding: "10px 15px",
							skin: "ui-dialog-skin-vip",
							lock: true,
							ok: function() {
								rebindGroup(rsp.data.asidInfoList[0].asid, rsp.data.sid, this);
							},
							okValue: "确定复活",
							cancelValue: "暂不复活",
							cancel: function() {}
						}).showModal();
					} else {
						$input.val("");
						dialog.showMsgBox(rsp["desc"]);
					}
				} else {
					if(rsp["code"] == -1)
					{
						dialog.showMsgBoxOkFun(rsp["desc"],"开通OW会员",function(){
							window.open("http://vip.yy.com/vip/vmall2/owvippay","_target")
						});
						return;
					}
					dialog.showMsgBox(rsp["desc"]);
				}
			}
		});
	});



	//邦定复活群号动作
	var rebindGroup = function(asid, sid, element) {
		$.ajax({
			url: "/service/web/nicecode/rebind/bind",
			type: "GET",
			dataType: "json",
			cache: false,
			data: {
				sid: sid,
				asid: asid
			},
			context: element,
			success: function(rsp) {
				if (rsp.result) {
					$("#rebindCount").text(rsp.data);
					dialog.showMsgBox(rsp.desc);
				} else {
					dialog.showMsgBox(rsp.desc);
				}
			}
		});
	};

	$('#customNav').on('click', 'a', function() {
		if ($(this).hasClass('active')) {
			return;
		}
		var _type = $(this).data('type');

		$('#table-' + _type).show().siblings('.custom-search-rule').hide();
		$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
		_currentConfig = _nicecodeConfig[_type - 1];
		
		getCodeList(_currentConfig);

	}).find('a[data-type=' + _NiceCodeType + ']').trigger('click');


	$.ajax({
		url: "/service/web/nicecode/ResurrectionTime",
		type: "GET",
		dataType: "json",
		cache: false,
		success: function(rsp) {
			$("#rebindCountLabel").text(rsp.data);
		}
	});



});