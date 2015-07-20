define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");
	var userinfo = require("../../mod/login.js");
	var template = require("../../lib/template.min.js");
	var dialog = require("../../mod/dialog/dialog");
	require('../../mod/header');
	require('../../mod/ajaxhelper');
	require("./nicecodenav");

	var LoginInfo = require('../../mod/login');
	var _UserInfo;
	LoginInfo.getUserInfo(function(userinfo) {
		_UserInfo = userinfo;
		if (userinfo && userinfo.data && userinfo.data.info && userinfo.data.info.vipUser) {}
	});
	
	//格式化时间
	template.helper("$dateFormat", function(content) {
		time = new Date(content);
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var date = time.getDate();
		var hour = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();

		return year + "-" + (month >= 10 ? month : ("0" + month)) + "-" + (date >= 10 ? date : ("0" + date)) + " " + (hour >= 10 ? hour : ("0" + hour)) + ":" + (minute >= 10 ? minute : ("0" + minute)) + ":" + (second >= 10 ? second : ("0" + second));
	});
	var couponAllGoodList = {1:"频道靓号",2:"YY靓号",3:"Y秀",4:"V卡",6:"频道加油卡",7:"活动会员时长",8:"情侣靓号",13:"定制yy号"};
	//格式化产品名
	template.helper("$getGoodsName",function(content){
		var lists = content.split(','),ret='';
		for(var i = 0 ; i< lists.length; i++){         
		     ret += '和' + (couponAllGoodList[lists[i]]?couponAllGoodList[lists[i]]:'');
		 }
		 return ret.substring(1);

	});

	template.helper("$moneyFormat", function fmoney(s, n) //将数字转换成逗号分隔的样式,保留两位小数s:value,n:小数位数     
		{
			n = n > 0 && n <= 20 ? n : 2;
			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			var l = s.split(".")[0].split("").reverse(),
				r = s.split(".")[1];
			t = "";
			for (i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			return t.split("").reverse().join("") + "." + r;
		});


	//页面的类型　链接参数　1-单号靓号;2-频道靓号;
	var _NiceCodeType = 1,
		_currentConfig;

	var r = window.location.search.substr(1).match(/(^|[&|?])type=([^&]*)(&|$)/);
	if (r != null) {
		_NiceCodeType = unescape(r[2]);
	}

	var _nicecodeConfig = [{
		tpl: 'tpl_orderbuy_List',
		contaner: 'orderbuy_List',
		datafiled: 'orderbuy'
	}, {
		tpl: 'tpl_history_List',
		contaner: 'history_List',
		datafiled: 'history'

	}, {
		tpl: 'tpl_couponList_List',
		contaner: 'couponList_List',
		datafiled: 'couponList'
	}];
	//号码搜索结果列表


	var pagehelper = require('../../mod/pagehelper.js');

	function getListDatas(config) {
		$("#imListBox .loading").show();
		$.ajax({
			url: "/service/web/nicecode/mine/info",
			dataType: 'json',
			data: {
				listData: 1
			},
			success: function(rsp) {
				$("#imListBox .loading").hide();
				if (rsp.result) {
					var datas = rsp.data[config.datafiled];
					
					$('#' + config.contaner).html(template(config.tpl, {
						datas: datas
					}));
				}
			}
		});
	}



	$('#customNav').on('click', 'a', function() {
		if ($(this).hasClass('active')) {
			return;
		}
		var _type = $(this).data('type');

		$('#table-' + _type).show().siblings('.custom-search-rule').hide();
		$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
		_currentConfig = _nicecodeConfig[_type - 1];

		//$('#imListBox').html('');

		getListDatas(_currentConfig);

	}).find('a[data-type=' + _NiceCodeType + ']').trigger('click');


	//绑定频道事件
	$("#orderlist").delegate(".j-bind", "click", initBindShortId);
	$("#orderlist").delegate(".repay-order", "click", orderRepay);
			

	function initBindShortId() {
		var $outBindChannel =  $(template("tpl_bindchannel",{}));
		var user = {imid:""};
		if(_UserInfo && _UserInfo.data)
			user = _UserInfo.data;
			
		var $outBindYY = $(template("tpl_bindyy",user));

		var $shortidContainer;
		var $channelInput;
		var $channelTipsContainer;
		var $channelTypeContainerSuc;
		var checkChannelFlag = false; //频道是否可以绑定
		var checkInputFlag = false; //输入的是否合法和有效


		var orderIndex = $(this).attr("data-set-id");
		var type = parseInt($(this).attr("data-set-type"), 10);
		var mainText = "频道靓号";
		var mainBindText = "频道号";
		var $bindChannel;

		switch (type) {
			case 1:
			case 12:
				mainText = "频道靓号";
				mainBindText = "频道号";
				$bindChannel = $outBindChannel;
				break;
			case 2:
			case 13:
			case 21:
				mainText = "YY靓号";
				mainBindText = "YY号";
				$bindChannel = $outBindYY;
				break;
			default:
				mainText = "频道靓号";
				mainBindText = "频道号";
				$bindChannel = $outBindChannel;
				break;
		}

		$shortidContainer = $bindChannel.find(".j-shortid");
		$channelInput = $bindChannel.find(".j-channelinput");
		$channelTipsContainer = $bindChannel.find(".j-channeltips");
		$channelTypeContainerSuc = $bindChannel.find(".j-channeltypesuc");
		checkChannelFlag = false; //频道是否可以绑定
		checkInputFlag = false; //输入的是否合法和有效

		$channelInput.data("code", orderIndex);
		$channelTipsContainer.hide();
		$channelTypeContainerSuc.hide();
		$channelInput.val("");
		checkChannelFlag = false;
		checkInputFlag = false;

		if (type == 1 || type == 12) {
			var cont = $bindChannel;
			cont.show();
			$.ajax({
				url: "/service/web/nicecode/mine/code/gobind",
				dataType: "json",
				type: "GET",
				data: {
					orderId: orderIndex
				},
				cache: false,
				success: function(data) {
					if (data["result"]) {
						$shortidContainer.html("<em style='margin-right:3px;'>&nbsp;</em>" + mainText + "：" + data.data.asid);
						dialog({
							id: "channelbindtips",
							title: '提示',
							skin: "ui-dialog-skin-vip",
							content: cont,
							okValue: "确定",
							padding: "10px 15px",
							lock: true,
							ok: function() {
								var value = $.trim($channelInput.val());
								if (!value ||value.length == 0) {
									checkInputFlag = false;
									$channelTipsContainer.html("所绑定的" + mainBindText + "不能为空").show();
									$channelTypeContainerSuc.hide();
									return false;
								}
								if (!(/^\d+$/.test(value))) {
									checkInputFlag = false;
									$channelTipsContainer.html("所绑定的" + mainBindText + "必须为数字，您输入了非法字符！").show();
									$channelTypeContainerSuc.hide();
									return false;
								}
								if (checkInputFlag && checkChannelFlag) { //进行绑定
									$.ajax({
										url: "/service/web/nicecode/mine/code/bind",
										dataType: "json",
										type: "GET",
										cache: false,
										data: {
											channel: value
										},
										success: function(data) {
											if (data.code == 1000) {
												window.showUdbLogin();
											} else {
												dialog.showMsgBox(data["desc"]);
											}
										}
									});
								} else {
									$.ajax({
										url: "/service/web/nicecode/mine/code/check",
										dataType: "json",
										type: "GET",
										cache: false,
										context: $channelInput.node,
										data: {
											channel: value
										},
										success: function(data) {
											if (data["result"]) {
												switch (data["code"]) {
													case 1000:
														window.showUdbLogin();
														break;
													case 1:
														checkChannelFlag = false;
														checkInputFlag = false;
														$channelTipsContainer.html(data["desc"]).show();
														$channelTypeContainerSuc.hide();
														break;
													case 2:
														checkChannelFlag = false;
														checkInputFlag = false;
														$channelTipsContainer.html(data["desc"] + '<a class="j-checkchannel" href="http://hao.yy.com/owauth/authDefault" target="_blank" style="text-decoration:underline;">现在认证</a>').show();
														$channelTypeContainerSuc.hide();
														break;
													case 3:
														checkChannelFlag = true;
														checkInputFlag = true;
														$channelTipsContainer.hide();
														$channelTypeContainerSuc.show();
														break;
												}
											}
										}
									});
									return false;
								}
							},
							cancel: function() {},
							cancelValue: "取消"
						}).showModal();
						
					} else {
						dialog.showMsgBox(data.desc);
					}
				}
			});
		} else if (type == 2 || type == 13 || type == 21) {
			$.ajax({
				url: "/service/web/nicecode/mine/code/checkImidOrder",
				dataType: "json",
				type: "GET",
				data: {
					orderId: orderIndex
				},
				cache: false,
				success: function(rsp) {
					if (rsp.result) {
						$shortidContainer.html("<em style='margin-right:3px;'>&nbsp;</em>" + mainText + "：" + rsp.data.newImid);
						dialog({
							id: "channelbindtips",
							title: '提示',
							content: $bindChannel.get(0),
							okValue: "确定",
							padding: "10px 15px",
							lock: true,
							ok: function() {
								$.ajax({
									url: "/service/web/nicecode/bindImid",
									dataType: "json",
									type: "GET",
									data: {
										orderId: orderIndex
									},
									cache: false,
									success: function(rsp) {
										if (rsp.code == 200) {
											dialog.showMsgBox(rsp.desc, "温馨提示", function() {
												window.location.href = "https://udb.yy.com/";
											});
										} else {
											dialog.showMsgBox(rsp.desc);
										}
									}
								});
							},
							cancel: function() {},
							cancelValue: "取消"
						}).showModal();

					} else {
						dialog.showMsgBox(rsp.desc);
					}
				}
			});
		} else if (type == 8) {
			window.location.href = "/vip/nicecode/loveractive?orderId=" + orderIndex;
		}
	}

	function orderRepay() {
		var orderId = $(this).attr("data-id");
		var payType = $(this).attr("data-payType");
		$.ajax({
			url: "/service/web/nicecode/checkRepay",
			dataType: "json",
			type: "GET",
			cache: false,
			async: false,
			data: {
				'orderId': orderId
			},
			success: function(rsp) {
				if (rsp.result) {
					$.ajax({
						url: "http://vip.yy.com/vip/vmall2/productRepay",
						dataType: "json",
						type: "GET",
						cache: false,
						async: false,
						data: {
							'orderId': orderId,
							'payType': payType
						},
						success: function(payRsp) {
							if (payRsp.result) {
								window.open(payRsp.data.url, '_blank');
							} else {
								dialog.showMsgBox(payRsp.desc);
							}
						}
					});
				} else {
					dialog.showMsgBox(rsp.desc);
				}
			}
		});


	}

});