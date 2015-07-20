define(function(require, exports, module) {
	require("../../mod/header.js");
	var userinfo = require("../../mod/login.js");
	var $ = jQuery = require("../../lib/jquery.min.js");
	var template = require("../../lib/template.min.js");
	var niftyplayer = require("../../mod/niftyplayer.js");
	var dialog = require("../../mod/dialog/dialog");
	var currentUserInfo;
	var baseSetStr = '/service/web/setting/';
	
	var FlashAvatar = require("../../mod/flashavatar.js")();
	
	require('../../mod/screenWatch');
	require('../../mod/ajaxhelper');

	var _success_tpl = '<div class="alert-box__bd"><div class="sys-tips sys-tips--succeed">' +
		'<i></i><span class="sys-tips__txt"><strong>设置成功</strong></span>' +
		'</div><div class="alert-box__txt">' +
		'<p>{{desc}}</p>' +
		'</div></div>';
	var _fail_tpl = '<div class="alert-box__bd"><div class="sys-tips sys-tips--error">' +
		'<i></i><span class="sys-tips__txt"><strong>设置失败</strong></span>' +
		'</div><div class="alert-box__txt">' +
		'<p>{{desc}}</p>' +
		'</div></div>';

	function showMsgBox(content) {
		dialog.showMsgBox(content);
	}


	function checkLogin() {

		if (currentUserInfo != null && currentUserInfo.result) {
			return true;
		};
		showUdbLogin();
		return false;
	}

	var popupLoaded = false,
		skinLoaded = false,
		frameLoaded = false,
		currentTabTarget = null,//为了右边预览的滚动到顶的时候固定
		currentPreviewTop = 0,
		currentPreviewLeft = 0;
	//点击选中，ie下去除outline
	$(".side-privilege_list").delegate('a', 'click', function() {
		$(this).parent().addClass('current').siblings().removeClass('current');
		$(".tab-box__bd").hide();
		$("#tab-box-" + $(this).data("target")).show();

		currentTabTarget = $("#tab-box-" + $(this).data("target"));
		if(currentTabTarget.find(".mod-preview").length > 0){
			currentPreviewTop = currentTabTarget.find(".mod-preview").offset().top;
			currentPreviewLeft = currentTabTarget.find(".mod-preview").offset().left;
		}
		if($(this).data("intro")){
			$(".box__hd__title-link").attr("href","http://vip.yy.com/vip/introduction#"+$(this).data("intro")).show();
		}else{
			$(".box__hd__title-link").hide()
		}

		//加载消息气泡
		if($(this).data("intro") == "23"){
			if(!popupLoaded){
				loadPopupContent();
				popupLoaded = true;
			}
		}
		//加载资料卡皮肤
		else if($(this).data("intro") == "24"){
			if(!skinLoaded){
				loadSkinContent();
				skinLoaded = true;
			}
		}
		//加载头像框饰
		else if($(this).data("intro") == "25"){
			if(!frameLoaded){
				loadFrameContent();
				frameLoaded = true;
			}
		}

	}).delegate('a', 'focus', function(event) {
		if (this.blur) {
			this.blur();
		}
	});

	var _targetTab = window.location.hash;
	if (_targetTab && /^[0-8]$/.test(_targetTab.substring(1))) {
		$($(".side-privilege_list").find('a')[_targetTab.substring(1)]).trigger('click');
	} else {
		$(".side-privilege_list").find('a').first().trigger('click');
	}

	userinfo.getUserInfo(function(info) {

		currentUserInfo = info;

		initDefaultInfo();
		initSettingInfo();

		if (!info.result) {
			showUdbLogin();
		}
		if (info.result && info.data != null && info.data.info.vipUser) {
			var vipinfo = info.data.info;
			$(".ringing__note").html('<i class="vip-level v' + vipinfo.vipLevel + '"></i>你好，你当前是<strong>VIP' + vipinfo.vipLevel + '</strong>，VIP6与年费会员可以设置所有音乐，享有无限次修改的权限哦~');
			//年费不获取红名列表
			if (vipinfo.feeType == 1) {
				$(".red-name__p").html("您是尊贵的<span>年费会员</span>，无需设置即享有全频道红名特权！").show();
			} else if (vipinfo.vipLevel >= 6) {
				$(".red-name__p").html("您是尊贵的<span>V" + vipinfo.vipLevel + "会员</span>，无需设置即享有全频道红名特权！").show();
			} else {
				$("#firstChannel").removeAttr("disabled");
				$("#secondChannel").removeAttr("disabled");
				if (vipinfo.vipLevel >= 3 && vipinfo.vipLevel <= 5) {
					$("#thirdChannel").removeAttr("disabled");
				}
			}
		}
		
		//皮肤下的头像
		var imgurl = info.data.logo;
		var name = info.data.nick;
		if(!info.result){
			imgurl = "http://dl.vip.yy.com/yyvippicture/webvipcom/1.png";
			name = "";
		}
		name = name.replace(/>/ig, "&gt;").replace(/</ig, "&lt;");
		$("#skin_preview_pinfo-name_cnt").text(name);
	});

	function getRedNameList() {
		$.ajax({
			url: baseSetStr + 'getRedNameList',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result) {
					var data = rsp.data;
					var level = data.vipLevel;
					var ids = data.ids;
					var currentSetSize = 0;
					if (ids == null) {
						currentSetSize = 0;
					} else {
						currentSetSize = ids.length;
					}

					var redNameCount = data.redNameCount;
					if (redNameCount < 0) {
						redNameCount = 0;
					}
					if (data.feeType == 1 || level >= 6) {
						if (data.feeType == 1) {
							$(".red-name__p").html("您是尊贵的<span>年费会员</span>，无需设置即享有全频道红名特权！").show();
						} else {
							$(".red-name__p").html(
								"您是<span>VIP" + level + "</span>，无需设置即享有全频道红名特权！").show();
						}
					} else {
						if (data.vipUser == false || data.expired == true) {
							if (data.vipUser == false) {
								$(".red-name__p").html("您目前还不是YY会员，无法享受频道红名特权！").show();
							} else {
								$(".red-name__p").html("您的YY会员资格已过期，无法享受频道红名特权！").show();
							}
						} else {
							var desc = "亲爱的VIP" + level + "用户，您可以设置 " + redNameCount + " 个红名频道，还有 " + data.resetCount + " 次修改机会";
							$(".red-name__p").html(desc).show();
						}
					}
				}
				for (var i = 1; i < 4; i++) {
					$("#redName" + i).val("").next("input").val("");
				}
				for (var i = 0; i < currentSetSize; i++) {
					$("#redName" + (i + 1)).val(ids[i]).next("input").val(ids[i]);
				}
				for (var i = 0; i < redNameCount; i++) {
					$("#redName" + (i + 1)).attr("disabled", false);
				}
			}
		});
	}
	getRedNameList();

	$("#red-name-submit").click(function() {
		if (!checkLogin()) {
			return;
		} else if (currentUserInfo.data.info.feeType == 1) {
			showMsgBox('您是尊贵的年费会员，无需设置即享有全频道红名特权！');
			return;
		}

		var redNameList = [],oldRedNameList = [];
		for (var i = 1; i < 4; i++) {
			if ($("#redName" + i).attr("disabled") == null) {
				var newName = $.trim($("#redName" + i).val());
				if(newName == ""){
					continue ;
				}
				if ($("#redName" + i).next("input").val() == "") {
					redNameList.push(newName);
				}else if(newName != $("#redName" + i).next("input").val()){
					oldRedNameList.push($("#redName" + i).next("input").val()+","+newName);
				}
			}
		}
		setRedName(redNameList,oldRedNameList);
	});

	$(".online-privilege__hd li").click(function() {
		$(this).addClass('current').siblings().removeClass('current');
		$("#set-" + $(this).data("type")).show();
		$("#set-" + $(this).siblings().data("type")).hide();
	});

	function setRedName(list,resetList) {
		if (!checkLogin()) {
			return;
		}
		$.ajax({
			url: baseSetStr + 'saveRedName',
			cache: false,
			dataType: 'json',
			data: {
				setIids: list.join(','),
				resetIds: resetList.join(':')
			},
			context: {
				maskId: 'red-name-submit'
			},
			success: function(rsp) {
				if (rsp.result) {
					showMsgBox(template.compile(_success_tpl)({
						desc: "保存红名设置成功！"
					}));
					//template.compile(_success_tpl)(rsp);   
					//template.compile(_fail_tpl)(rsp);     

					var desc = "亲爱的VIP" + rsp.data.level + "用户，您可以设置 " + rsp.data.redNameCount + " 个红名频道，还有 " + rsp.data.resetCount + " 次修改机会";
					$(".red-name__p").html(desc).show();
				} else {
					var ret = parseInt(rsp.data.reason);
					if(ret == 2 || ret == 9){
               showMsgBox("设置失败，请确认频道ID是否存在！");
          }else if(ret == 11){
               showMsgBox("设置失败，修改的红名频道个数超过次数限制！");
          }else{
               showMsgBox("设置失败，系统繁忙，请稍后再试！");
          }
				}
			}
		})
	}
	
	function initDefaultInfo() {
		$.ajax({
			url: baseSetStr + 'defaultInfo',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				//if (!rsp.data.showForOthers) {
				//	$("#skin-showtoother").removeAttr('checked');
				//}
				//渲染皮肤
				var skins = template('skin-list', rsp.data);
				$(".skin-select__list").html(skins);
				$(".skin-select__list").on('click', 'a', function() {
					$(".skin-select__list a").removeClass('select-skin');
					$(this).addClass('select-skin');
					$(".skin-preview__img").css("background", "url(" + $(this).data('skin') + ") no-repeat");
				});
				$(".skin-preview__img").css("background", "url(" + rsp.data.userSkin + ") no-repeat");
				//渲染头像
				var logos = template('logo-list', rsp.data);
				$(".face-select__list").html(logos);
				$(".face-select__list").on('click', 'a', function() {
					$(".face-select__list a").removeClass('select-logo');
					$(this).addClass('select-logo');
					$(".face-preview img").attr("src", $(this).data('logo'));
				});
				$(".face-preview img").attr("src", rsp.data.logoUrl);
				//皮肤下的头像
				FlashAvatar.embedCircleAvatar("skin_preview_pinfo_show_image", rsp.data.logoUrl ? rsp.data.logoUrl : "http://dl.vip.yy.com/yyvippicture/webvipcom/1.png");
				
				var vipLevel;
				if (currentUserInfo.data.info == null || !currentUserInfo.data.info.vipUser) {
					vipLevel = "0";
					disableTableTr([$("#ring-box-vip12"), $("#ring-box-vip35"), $("#ring-box-vip6year"), $("#voice-box-vip12"), $("#voice-box-vip35"), $("#voice-box-vip6year"), $("#remind-box-vip12"), $("#remind-box-vip35"), $("#remind-box-vip6year")]);
				} else {
					vipLevel = currentUserInfo.data.info.vipLevel + "";
					if (currentUserInfo.data.info.feeType != 1) {
						if (vipLevel <= 2) {
							disableTableTr([$("#ring-box-vip35"), $("#ring-box-vip6year"), $("#voice-box-vip35"), $("#voice-box-vip6year"), $("#remind-box-vip35"), $("#remind-box-vip6year")]);
						} else if (vipLevel <= 5) {
							disableTableTr([$("#ring-box-vip6year"), $("#voice-box-vip6year"), $("#remind-box-vip6year")]);
						}
					}
				}

				//渲染上线提醒铃声
				templateRingData(rsp.data.remindList, "remind");
				$("#remind-box").on('click', ':radio', function() {
					$("#remind-box__select").data("remindid", $(this).data("id"));
				});
				//渲染一对一铃声
				templateRingData(rsp.data.voiceList, "voice");
				$("#voice-box").on('click', ':radio', function() {
					$("#voice-box-select").data("voiceid", $(this).data("id")).html("当前选择:<em>" + $(this).data("name") + "</em>");
				});
				$("#voice-box-submit").click(function() {
					if (!checkLogin()) {
						return;
					}
					var voiceid = $("#voice-box-select").data("voiceid");
					if (voiceid == 0) {
						showMsgBox("请选择消息提醒铃声");
					} else {
						$.ajax({
							url: '/service/web/ring/ring/commit',
							dataType: 'json',
							data: {
								type: 2,
								ringId: voiceid,
								inputCode: ''
							},
							success: function(rsp) {
								if (rsp.result) {
									showMsgBox(template.compile(_success_tpl)({
										desc: "一对一语音设置成功！"
									}));
								} else {
									if(rsp.data.remains <= 0){
										rsp.desc = "你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦";
									}
									showMsgBox(template.compile(_fail_tpl)(rsp));
								}
							}
						});
					}
				});
				$("#voice-box-reset").click(function() {
					if (!checkLogin()) {
						return;
					}
					$.ajax({
						url: '/service/web/ring/ring/default',
						dataType: 'json',
						data: {
							type: 2
						},
						success: function(rsp) {
							if (rsp.result) {
								showMsgBox(template.compile(_success_tpl)({
									desc: "一对一语音设置恢复默认成功"
								}));
								$("#voice-box :radio").attr('checked', false);
								$("#voice-box-select").html("当前选择:<em>无</em>").data("voiceid",0);
							} else {
								if(rsp.data.remains <= 0 && rsp.data.fee != 1){
									rsp.desc = "你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦";
								}
								showMsgBox(template.compile(_fail_tpl)(rsp));
							}
						}
					});
				});
				//渲染消息铃声
				templateRingData(rsp.data.ringList, "ring");
				$("#ring-box").on('click', ':radio', function() {
					$("#ring-box-select").data("ringid", $(this).data("id")).html("当前选择:<em>" + $(this).data("name") + "</em>");
				});
				$("#ring-box-submit").click(function() {
					if (!checkLogin()) {
						return;
					}
					var ringid = $("#ring-box-select").data("ringid");
					if (ringid == 0) {
						showMsgBox("请选择消息提醒铃声");
					} else {
						$.ajax({
							url: '/service/web/ring/ring/commit',
							dataType: 'json',
							data: {
								type: 1,
								ringId: ringid,
								inputCode: ''
							},
							context: {
								maskId: this
							},
							success: function(rsp) {
								if (rsp.result) {
									//年费会员没有次数上限
									if(rsp.data.remains <= 0 && rsp.data.fee != 1){
										rsp.desc = "你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦";
										showMsgBox(template.compile(_fail_tpl)(rsp));
									}
									else{
										showMsgBox(template.compile(_success_tpl)({
											desc: "消息铃声设置成功"
										}));
									}
								} else {
									showMsgBox(template.compile(_fail_tpl)(rsp));
								}
							}
						});
					}
				});
				$("#ring-box-reset").click(function() {
					if (!checkLogin()) {
						return;
					}
					$.ajax({
						url: '/service/web/ring/ring/default',
						cache: false,
						dataType: 'json',
						data: {
							type: 1
						},
						success: function(rsp) {
							if (rsp.result) {
								showMsgBox(template.compile(_success_tpl)({
									desc: "消息铃声设置恢复默认成功"
								}));
								$("#ring-box :radio").attr('checked', false);
								$("#ring-box-select").html("当前选择:<em>无</em>").data("ringid",0);
							} else {
								if(rsp.data.remains <= 0 && rsp.data.fee != 1){
									rsp.desc = "你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦";
								}
								showMsgBox(template.compile(_fail_tpl)(rsp));
							}
						}
					});
				});
				$(".ring-box__table").on('click', 'a', function() {
					niftyplayer.loadAndPlay($(this).data("url"));
				});

				getMyRingInfo();
			}
		})
	};

	function getMyRingInfo() {
		$.ajax({
			url: '/service/web/ring/ring/info',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result) {
					$("#ring-box :radio[data-id=" + rsp.data.ringid1 + "]").trigger('click');
					$("#voice-box :radio[data-id=" + rsp.data.ringid2 + "]").trigger('click');
				}
			}
		});
	}

	function templateRingData(list, type) {
		var ringData = {};
		ringData.type = type;
		ringData.data = resetRingList(list, '2');
		$("#" + type + "-box-vip12").html(template('ring-list', ringData));
		ringData.data = resetRingList(list, '5');
		$("#" + type + "-box-vip35").html(template('ring-list', ringData));
		ringData.data = resetRingList(list, '6');
		$("#" + type + "-box-vip6year").html(template('ring-list', ringData));
	}

	//将表格行置为失效
	function disableTableTr(list) {
		for (var i = 0; i < list.length; i++) {
			list[i].parent('tr').addClass('disable');
		};
	}

	function resetRingList(list, levelRequest) {
		//id type name url levelRequest
		if (!checkLogin()) {
			return;
		}
		var arr = [];
		for (var i = list.length - 1; i >= 0; i--) {
			if (currentUserInfo.data.info == null || !currentUserInfo.data.info.vipUser) {
				list[i].disabled = true;
			} else if (currentUserInfo.data.info.feeType == 1) {
				list[i].disabled = false;
			} else {
				list[i].disabled = $.inArray(currentUserInfo.data.info.vipLevel + "", list[i].levelRequest) == -1;
			}
			if ($.inArray(levelRequest, list[i].levelRequest) != -1) {
				arr = arr.concat(list.splice(i, 1));
			}
		};
		return arr;
	}

	var _friends_list = [];

	function initSettingInfo() {
		$.ajax({
			url: '/service/web/ring/getFriends',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result && rsp.data.friends != null) {
					_friends_list = rsp.data.friends;
					$(".firend-box__bd table").html(template("friend-list", {
						list: _friends_list[0]
					}));

					var _tpl = '<select>' +
						'{{each groups as v i}}' +
						'<option value="{{i}}">{{v}}</option>' +
						'{{/each}}' +
						'</select>';

					$('#selFirends1,#selFirends2').html(template.compile(_tpl)(rsp.data));

				}
			}
		});
		initRingSetting();
		initOnlineSetting();
		initSettingBtn();
	}

	$('#selFirends1,#selFirends2').delegate('select', 'change', function() {
		$(this).parent('.firend-box__hd').siblings('.firend-box__bd').find('table').html(template("friend-list", {
			list: _friends_list[$(this).val()]
		}));
	});


	function initRingSetting() {
		$.ajax({
			url: '/service/web/ring/getRingSettings',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result) {
					if(rsp.data.remindRingSettings){
						$("#remindRingSetNumber").html(rsp.data.remindRingSettings.length);
					}
					if(rsp.data.remindRingMaxNumber){
						$("#remindRingLeftNumber").html(rsp.data.remindRingMaxNumber - rsp.data.remindRingSettings.length);
					}
					var content = template("ring-set-friend-list", rsp.data);
					$("#remind-setting-table tbody").html(content);
				}
			}
		});
	}

	function initOnlineSetting() {
		$.ajax({
			url: baseSetStr + 'loadOnlineSettings',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				if (rsp.result) {
					$("#set-hideToOnline table").html(template("hideToOnline-set-list", rsp.data));
					$("#set-onlineToHide table").html(template("onlineToHide-set-list", rsp.data));
					$("#online-set-number").html(rsp.data.setNum);
					$("#online-set-left-number").html(rsp.data.canSet);
				}
			}
		});
	}

	function initSettingBtn() {

		/*$("#ring-box-submit").on('click', function() {
			if (!checkLogin()) {
				return;
			}
			var ringid = $("#ring-box-select").data("ringid");
			if (ringid == 0) {
				showMsgBox("请选择消息提醒铃声");
			} else {
				$.ajax({
					url: '/service/web/ring/ring/commit',
					cache: false,
					dataType: 'json',
					data: {
						ringId: ringid,
						type: 1,
						inputCode: ''
					},
					success: function(rsp) {
						showMsgBox(rsp.desc);
					}
				});
			}
		});
		$("#voice-box-submit").on('click', function() {
			if (!checkLogin()) {
				return;
			}
			var voiceid = $("#voice-box-select").data("voiceid");
			if (voiceid == 0) {
				showMsgBox("请选择一对一语音铃声");
			} else {
				$.ajax({
					url: '/service/web/ring/ring/commit',
					cache: false,
					dataType: 'json',
					context: {
						maskId: this
					},
					data: {
						ringId: voiceid,
						type: 2,
						inputCode: ''
					},
					success: function(rsp) {
						showMsgBox(rsp.desc);
					}
				});
			}
		});
		$("#voice-box-reset").on('click', function() {
			$.ajax({
				url: '/service/web/ring/default',
				cache: false,
				dataType: 'json',
				data: {
					type: 2
				},
				success: function(rsp) {
					showMsgBox(rsp.desc);
				}
			});
		});*/

		$("#remind-box-friends").delegate('.firend-box__set', 'click', function() {
			if (!checkLogin()) {
				return;
			}
			var remindid = $("#remind-box__select").data("remindid");
			if (remindid == 0) {
				showMsgBox("请选择上线提醒铃声");
			} else {
				$.ajax({
					url: '/service/web/ring/saveRemind',
					cache: false,
					dataType: 'json',
					data: {
						friendUid: $(this).data("uid"),
						ringId: remindid
					},
					context: {
						maskId: this
					},
					success: function(rsp) {
						if (rsp.result) {
							$("#remindRingSetNumber").html(rsp.data.settings.length);
							$("#remindRingLeftNumber").html(rsp.data.remindRingMaxNumber - rsp.data.settings.length);
							rsp.data.remindRingSettings = rsp.data.settings;
							var content = template("ring-set-friend-list", rsp.data);
							$("#remind-setting-table tbody").html(content);
						} else {
							showMsgBox(rsp.desc);
						}
					}
				});
			}
		});
		$(".remind-setting__bd").delegate('.remind-setting__cancel', 'click', function() {
			if (!checkLogin()) {
				return;
			}
			$.ajax({
				url: '/service/web/ring/removeRemind',
				cache: false,
				dataType: 'json',
				data: {
					removeIds: $(this).data("uid")
				},
				context: {
					maskId: this
				},
				success: function(rsp) {
					if (rsp.result) {
						$("#remindRingSetNumber").html(rsp.data.settings.length);
						$("#remindRingLeftNumber").html(rsp.data.remindRingMaxNumber - rsp.data.settings.length);
						rsp.data.remindRingSettings = rsp.data.settings;
						var content = template("ring-set-friend-list", rsp.data);
						$("#remind-setting-table tbody").html(content);
					} else {
						showMsgBox(rsp.desc);
					}
				}
			});
		});
		$("#clear-all-remind").click(function() {
			var uids = [];
			$(".remind-setting__cancel").each(function(v, i) {
				uids.push($(this).data("uid"));
			});
			$.ajax({
				url: '/service/web/ring/removeRemind',
				cache: false,
				dataType: 'json',
				data: {
					removeIds: uids.join(",")
				},
				success: function(rsp) {
					$("#remindRingSetNumber").html(rsp.data.settings.length);
					$("#remindRingLeftNumber").html(rsp.data.remindRingMaxNumber - rsp.data.settings.length);
					rsp.data.remindRingSettings = rsp.data.settings;
					var content = template("ring-set-friend-list", rsp.data);
					$("#remind-setting-table tbody").html(content);
				}
			});
		});
		//好友在线特权的设置点击
		$("#online-set-friends").delegate('.firend-box__set', 'click', function() {
			if (!checkLogin()) {
				return;
			}
			var setType = 0;
			$.each($(".online-privilege__hd li.current"), function(n, i) {
				setType = $(this).data("settype");
			});
			$.ajax({
				url: '/service/web/setting/setOnlineHide',
				cache: false,
				dataType: 'json',
				data: {
					friendUid: $(this).data("uid"),
					setType: setType
				},
				context: {
					maskId: this
				},
				success: function(rsp) {
					if (rsp.result) {
						$("#set-hideToOnline table").html(template("hideToOnline-set-list", rsp.data));
						$("#set-onlineToHide table").html(template("onlineToHide-set-list", rsp.data));
						$("#online-set-number").html(rsp.data.setNum);
						$("#online-set-left-number").html(rsp.data.canSet);
					} else {
						showMsgBox(rsp.desc);
					}
				}
			});
		});
		$(".select-persion__bd").delegate('.setting__cancel', 'click', function(event) {
			if (!checkLogin()) {
				return;
			}
			$.ajax({
				url: '/service/web/setting/setOnlineHide',
				cache: false,
				dataType: 'json',
				data: {
					friendUid: $(this).data("uid"),
					setType: $(this).data("settype")
				},
				context: {
					maskId: this
				},
				success: function(rsp) {
					if (rsp.result) {
						$("#set-hideToOnline table").html(template("hideToOnline-set-list", rsp.data));
						$("#set-onlineToHide table").html(template("onlineToHide-set-list", rsp.data));
						$("#online-set-number").html(rsp.data.setNum);
						$("#online-set-left-number").html(rsp.data.canSet);
					} else {
						showMsgBox(rsp);
					}
				}
			});
		});
	}

	$("#select-skin-submit").click(function() {
		if (!checkLogin()) {
			return;
		}
		var selectSkin = $(".skin-select__list a.select-skin");
		if (selectSkin.length == 0) {
			showMsgBox("请选择皮肤");
		} else {
			$.ajax({
				url: baseSetStr + 'setSkin',
				cache: false,
				dataType: 'json',
				context: {
					maskId: 'select-skin-submit'
				},
				data: {
					showForOther: $("#skin-showtoother").prop("checked"),
					url: selectSkin.data("skin")
				},
				success: function(rsp) {
					if (rsp.result) {
						rsp.desc = "";
						showMsgBox(template.compile(_success_tpl)(rsp));
					} else {
						showMsgBox(template.compile(_fail_tpl)(rsp));
					}
				}
			});
		}
	});

	$("#select-logo-submit").click(function() {
		if (!checkLogin()) {
			return;
		}
		var selectLogo = $(".face-select__list a.select-logo");
		if (selectLogo.length == 0) {
			showMsgBox("请选择头像");
		} else {
			$.ajax({
				url: baseSetStr + 'setLogo',
				cache: false,
				dataType: 'json',
				context: {
					maskId: this
				},
				data: {
					logoId: selectLogo.data("logoid")
				},
				success: function(rsp) {
					if (rsp.result) {
						rsp.desc = "";
						//增加皮肤头像下的代码
						FlashAvatar.embedCircleAvatar("skin_preview_pinfo_show_image", selectLogo.attr("data-logo"));
						showMsgBox(template.compile(_success_tpl)(rsp));
					} else {
						showMsgBox(template.compile(_fail_tpl)(rsp));
					}
				}
			});
		}
	});

	//加载对话气泡
	function showBubbleList(rsp){
		$(".popup-select__list").html(template("popupTpl",rsp));
		$(".popup-select__list a:first").trigger("click");
	}
	window.showBubbleList = showBubbleList;
	function loadPopupContent(){
		$.getScript("http://do.yy.duowan.com/yy7/bubbles.json");

		$(".popup-select__list").delegate("a","click",function(){
			$(".popup-select__list a").removeClass("selected");
			$(this).addClass("selected");
			$(".popup-preview__img--s").removeClass().addClass("popup-preview__img--s popup-preview__img--s"+$(this).data("id"));
		});

		$("#select-popup-submit").on("click",function(){
			if (!checkLogin()) {
				return;
			}
			$.ajax({
				url:'http://mysettings.yy.com/front/saveVipBubble?appId=5060&sign=&data={"bubbleid":'+$(".popup-select__list a.selected").data("id")+'}',
				dataType:"jsonp",
				context : {maskId:this},
				success:function(rsp){
					if(rsp.resultcode == 0){
						showMsgBox(template.compile(_success_tpl)({
							desc: "消息气泡设置成功！"
						}));
					}
					else{
						var isNotVip = false;
						if(rsp.resultcode == 10){
							isNotVip = true;
							rsp.desc = "成为YY会员，立享多彩对话气泡特权！";
						}
						else{
							rsp.desc = "设置消息气泡失败！";
						}
						dialog({
			                id: "dialogMsgBox",
			                padding: "10px 15px",
			                skin: "ui-dialog-skin-vip",
			                content: template.compile(_fail_tpl)(rsp),
			                okValue:isNotVip?"开通会员":"确定",
			                ok:function(){
			                	if(isNotVip){
			                		window.open("http://vip.yy.com/vip/vmall2?type=year","_blank");
			                	}
			                }
			            }).showModal();
					}
				}
			})
		});
	}

	//加载资料卡皮肤
	function showSkinList(rsp){
		$(".infoskin-select__list").html(template("infoskinTpl",rsp));
		$(".infoskin-select__list a:first").trigger("click");
	}
	window.showSkinList = showSkinList;
	function loadSkinContent(){
		$.getScript("http://do.yy.duowan.com/yy7/skins.json");

		//获取y秀图片
		$.ajax({
			url:'http://show.vip.yy.com/service/web/vinfo',
			dataType:'jsonp',
			success:function(rsp){
				if(rsp.result && rsp.data.yshowImg){
					$(".infoskin-preview__yshow").attr("src",rsp.data.yshowImg);
				}
				else{
					$(".infoskin-preview__yshow").attr("src","http://dl2.vip.yystatic.com/yyvippicture/eba5c4ccab8e3d5d3f1e316ec616a8cf.png");
				}
			}
		});

		$(".infoskin-select__list").delegate("a","click",function(){
			$(".infoskin-select__list a").removeClass("selected");
			$(this).addClass("selected");
			$(".infoskin-preview__img").css("background-image","url("+$(this).data("imgurl")+")");
		});

		$("#select-infoskin-submit").on("click",function(){
			if (!checkLogin()) {
				return;
			}
			$.ajax({
				url:'http://mysettings.yy.com/front/saveVipSkin?appId=5060&sign=&data={"skinid":'+$(".infoskin-select__list a.selected").data("id")+'}',
				dataType:"jsonp",
				context : {maskId:this},
				success:function(rsp){
					if(rsp.resultcode == 0){
						showMsgBox(template.compile(_success_tpl)({
							desc: "资料卡皮肤设置成功！"
						}));
					}
					else{
						var isNotVip = false;
						if(rsp.resultcode == 10){
							isNotVip = true;
							rsp.desc = "成为YY会员，立享资料卡皮肤特权！";
						}
						else{
							rsp.desc = "设置资料卡皮肤失败！";
						}
						dialog({
			                id: "dialogMsgBox",
			                padding: "10px 15px",
			                skin: "ui-dialog-skin-vip",
			                content: template.compile(_fail_tpl)(rsp),
			                okValue:isNotVip?"开通会员":"确定",
			                ok:function(){
			                	if(isNotVip){
			                		window.open("http://vip.yy.com/vip/vmall2?type=year","_blank");
			                	}
			                }
			            }).showModal();
					}
				}
			})
		});
	}

	//加载头像框饰
	function showFramesList(rsp){
		$(".logoprecious-select__list").html(template("logopreciousTpl",rsp));
		$(".logoprecious-select__list a:first").trigger("click");
	}
	window.showFramesList = showFramesList;
	function loadFrameContent(){
		$.getScript("http://do.yy.duowan.com/yy7/frames.json");

		userinfo.getUserInfo(function(rsp){
			if(rsp.result){
				//拉取用户头像
				userinfo.getUserLogo(function(logoUrl){
					$(".logoprecious-preview__img img").attr("src",logoUrl);
				});
			}
			else{
				$(".logoprecious-preview__img img").attr("src","http://dl.vip.yy.com/yyvippicture/webvipcom/1.jpg");
			}
		});
		
		$(".logoprecious-select__list").delegate("a","click",function(){
			$(".logoprecious-select__list a").removeClass("selected");
			$(this).addClass("selected");
			$("#logoprecious-preview__icon1").css("background-image","url("+$(this).data("panelurl")+")");
			$("#logoprecious-preview__icon2").css("background-image","url("+$(this).data("imurl")+")");
		});

		$("#select-logoprecious-submit").on("click",function(){
			if (!checkLogin()) {
				return;
			}
			$.ajax({
				url:'http://mysettings.yy.com/front/saveVipFrame?appId=5060&sign=&data={"frameId":'+$(".logoprecious-select__list a.selected").data("id")+'}',
				dataType:"jsonp",
				context : {maskId:this},
				success:function(rsp){
					if(rsp.resultcode == 0){
						showMsgBox(template.compile(_success_tpl)({
							desc: "头像框饰设置成功！"
						}));
					}
					else{
						var isNotVip = false;
						if(rsp.resultcode == 10){
							isNotVip = true;
							rsp.desc = "成为YY会员，立享头像框饰特权！";
						}
						else{
							rsp.desc = "设置头像框饰失败！";
						}
						dialog({
			                id: "dialogMsgBox",
			                padding: "10px 15px",
			                skin: "ui-dialog-skin-vip",
			                content: template.compile(_fail_tpl)(rsp),
			                okValue:isNotVip?"开通会员":"确定",
			                ok:function(){
			                	if(isNotVip){
			                		window.open("http://vip.yy.com/vip/vmall2?type=year","_blank");
			                	}
			                }
			            }).showModal();
					}
				}
			})
		});
	}


	require.async('../../mod/swfobject.js', function(swfobject) {
		var params = {};
		params.quality = "high";
		params.bgcolor = "#ffffff";
		params.allowscriptaccess = "all";
		params.allowfullscreen = "true";
		swfobject.embedSWF(
			"/assets/flash/niftyplayer.swf?file=betty.mp3&as=0", "niftyPlayer1",
			"0", "0",
			"10.2.0", "/assets/flash/playerProductInstall.swf", {}, params, {});
	});

	$(window).scroll(handlePreviewScroll).resize(function(){
		currentPreviewTop = currentTabTarget.find(".mod-preview").offset().top;
		currentPreviewLeft = currentTabTarget.find(".mod-preview").offset().left;
		handlePreviewScroll();
	});

	function handlePreviewScroll(){
		if($(window).scrollTop() > currentPreviewTop){
			currentTabTarget.find(".mod-preview").addClass("fixed").css("left",currentPreviewLeft);
		}
		else{
			currentTabTarget.find(".mod-preview").removeClass("fixed");
		}
	}

	//载入顶部广告
	(function loadleft() {
		$.ajax({
			url: "http://vip.yy.com/vip/ad?adNo=10101",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				var source = '<a class="mod-axd" href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a>' + '<div class="mod-axd-bar"><span class="dot-left"></span></div>';
				var render = template.compile(source);
				if (rsp.data != null) {
					$('.user-profile-ad1').html(render(rsp.data));
				}
			}
		});
	})();
	
	//加载当前用户的图标
	(function initUserIcon(){
		$.ajax({
			url: "/service/web/nicecodeicon/index",
			type: 'GET',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				
				//测试
				/*rsp = {
					"result":true,
					"code":0,
					"desc":null,
					"data":{
						"changeIconChances":0,
						"icons":[{
						        	 "uid":50012903,
						        	 "endTime":"2038-07-11 23:59:59",
						        	 "priviType":8,
						        	 "type":5,
						        	 "name":"靓图标",
						        	 "inUse":1,
						        	 "iconUrl":"http://dl.vip.yy.com/icons/minicard_vip_prettynum_5.png"
						        }]
							}
						};*/
				
				var icons = rsp.data.icons;
				if(icons && icons.length){
					var temp = null;
					for(var i=0, len=icons.length; i<len; i++){
						temp = icons[i];
						if(temp.inUse === 1){
							rsp.data.selectedName = temp.name;
							rsp.data.selectedId = temp.priviType + ":" + temp.type;
							break;
						}
					}
				}
				if(rsp.code === 1000){
					if(typeof rsp.data === "object"){
						rsp.data.isLogin = false;
					}else{
						rsp.data = {isLogin: false};
					}
				}else{
					if(typeof rsp.data === "object"){
						rsp.data.isLogin = true;
					}else{
						rsp.data = {isLogin: true};
					}
				}
				$("#tab-box-setcode").html(template("tpl-managecode", rsp.data));
			}
		});
	})();
	
	//图标选择事件动作
	$(document.body).delegate("#tab-box-setcode .j-item", "click", function(){
		var $this = $(this);
		var pid = $this.attr("data-pid");
		var name = $this.find(".j-iconname").text();
		var $btn = $("#tab-box-setcode .j-btn");
		var $name = $("#tab-box-setcode .j-name");
		
		$this.addClass("selected").siblings().removeClass("selected");
		$name.html(name);
		$btn.attr("data-pid", pid);
	});
	//提交事件动作
	$(document.body).delegate("#tab-box-setcode .j-btn", "click", function(){
		var $this = $(this);
		var pids = $this.attr("data-pid").split(":");
		var $time = $("#tab-box-setcode .j-time");
		
		$.ajax({
			url: "/service/web/nicecodeicon/changeIcon",
			type: "GET",
			cache: false,
			dataType: "json",
			data: {priviType: pids[0], type: pids[1]},
			context: {maskId:this},
			success: function(rsp) {
				if(rsp.result){
					showMsgBox(rsp.desc);
				}else{
					if(rsp.code == -2){
						dialog({
			                padding: "10px 15px",
			                skin: "ui-dialog-skin-vip",
			                content: "你目前没有图标更换机会，兑换靓号图标变更卡，即可更换图标。",
			                okValue: "兑换变更卡",
			                ok:function(){
			                	window.open("http://vip.yy.com/vip/vcard/index#exchange|193");
			                }
			            }).showModal();
					}else if(rsp.code == -1){
						dialog({
			                padding: "10px 15px",
			                skin: "ui-dialog-skin-vip",
			                content: "开通会员即可设置靓号图标",
			                okValue: "开通会员",
			                ok:function(){
			                	window.open("http://vip.yy.com/vip/vmall2?type=year");
			                }
			            }).showModal();
					}else{
						showMsgBox(rsp.desc);
					}
				}
				$time.html(rsp.data);
			}
		});
	});
});