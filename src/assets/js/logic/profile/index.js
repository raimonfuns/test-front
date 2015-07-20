define(function(require, exports, module) {
	var userinfo = require("../../mod/login.js");
	var $ = jQuery = require("../../lib/jquery.min.js");
	var template = require("../../lib/template.min.js");
	require('../../mod/screenWatch');
	require('../../mod/header');

	//初始化等级横条间隔
	var vipLv = [0, 600, 1800, 3600, 6000, 10800, 30000, 88888],
		//vipWidth = [-10, 30, 80, 140, 240, 380, 650],
		vipWidth = [-10, 15, 45, 80, 140, 240, 380, 600],
		vipWidthValue = [0, 20, 50, 85, 145, 245, 380, 605],
		vipWidth_vlt7 = [-10, 25, 65, 120, 220, 360, 560, 700],
		vipWidthValue_vlt7 = [0, 30, 70, 125, 225, 360, 565, 705],
		formerWidth = 0;
	var vipLVAllLength = 730;
	var vipLVALLShow = 100000;
	$(".grow-progress__list li").each(function(i, v) {
		$(this).css("left", vipWidth[i]);
	});

	//重置成长值进度条
	function resetGrowValue(growth) {
		var valWidth = 0;
		/*if (growth >= 30000) {
			if (growth > 60000) {
				valWidth = 730;
			};
			valWidth = 650 + 18 + (growth - 30000) * 50 / 30000;
		} else if (growth >= 10800) {
			valWidth = 380 + 18 + (growth - 10800) * (650 - 380 - 18) / 19200;
		} else if (growth >= 6000) {
			valWidth = 240 + 18 + (growth - 6000) * (380 - 240 - 18) / 4800;
		} else if (growth >= 3600) {
			valWidth = 140 + 18 + (growth - 3600) * (240 - 140 - 18) / 2400;
		} else if (growth >= 1800) {
			valWidth = 80 + 18 + (growth - 1800) * (140 - 80 - 18) / 1800;
		} else if (growth >= 600) {
			valWidth = 30 + 18 + (growth - 600) * 32 / 1200;
		} else {
			valWidth = growth * 30 / 600;
		};*/
		
		//找到相应的点
		var baseGrowValue = 0;
		var baseShowPoint = 0;
		var lastestShowPoint = 0;
		var lastestGrowValue = 0;
		for(var i=0,len=vipLv.length-1; i<len; i++){
			if(growth >= vipLv[i] && growth <= vipLv[i+1]){
				baseGrowValue = vipLv[i];
				lastestGrowValue = vipLv[i+1];
				baseShowPoint = vipWidthValue[i];
				lastestShowPoint = vipWidthValue[i+1];
				break;
			}else if(growth > vipLv[len]){
				baseGrowValue = vipLv[len];
				lastestGrowValue = vipLVALLShow;
				baseShowPoint = vipWidthValue[len];
				lastestShowPoint = vipLVAllLength;
				break;
			}
		}
		
		//大于最大数时为总长
		if(growth >= vipLVALLShow){
			valWidth = vipLVAllLength;
		//确定值在刚好落在点上时
		}else if(baseGrowValue === growth){
			valWidth = baseShowPoint;
		}else if(lastestGrowValue === growth){
			valWidth = lastestShowPoint;
		//不是落在点上时
		}else{
			valWidth = (growth - baseGrowValue)*(lastestShowPoint - baseShowPoint)/(lastestGrowValue - baseGrowValue) + baseShowPoint;
		}

		$(".grow-progress__value").width(valWidth);
		$(".grow-progress__value_icon").css("left",valWidth-2)
	}

	$(".grow-progress__value_icon").on("mouseover",function(){
			$(".grow-progress__value_bg").show();
		}).on("mouseout",function(){
			$(".grow-progress__value_bg").hide();
		});

	//获取年费特权区间
	function getPeriod() {
		$.ajax({
			url: '/service/web/user/servicePeriod',
			cache: false,
			dataType: 'json',
			success: function(rsp) {
				//仅显示年费会员的特权区间
				if (rsp.result && rsp.data.feeType == 1) {
					$(".table-grow__vipexpire").append(template('growth-year', rsp.data));
					$(".vipexpire_line1").width(rsp.data.yearRate * 230);
					$(".angle2").css("left", rsp.data.yearRate * 230 - 3);
					$(".angle4").show().css("visibility", "visible");
					$(".vipexpire_rate").css('left', rsp.data.currentRate * 230);
					if (rsp.data.yearRate < 0.7) {
						$(".vipexpire_year").css('left', rsp.data.yearRate * 230 - 23);
					}
					$('body').delegate('.table-grow__vipexpire', 'mouseenter', function() {
						$(this).css("border-bottom", "none").find(".angle4").css("visibility", "hidden");
						$(".table-grow__item_vipexpire").show();
					}).delegate('.table-grow__vipexpire', 'mouseleave', function() {
						$(this).css("border-bottom", "1px solid #f2f2f2").find(".angle4").css("visibility", "visible");
						$(".table-grow__item_vipexpire").hide();
					});

				}
			}
		});
	}



	userinfo.getUserInfo(function(info) {
		if (info.result && info.data != null) {

			if(info.data.info.vipLevel < 7){
				vipWidth = vipWidth_vlt7;
				vipWidthValue = vipWidthValue_vlt7;
				$(".grow-progress__list li").each(function(i, v) {
					$(this).css("left", vipWidth[i]);
				});
			}

			var content = template("user-profile-info", info.data);
				//单独设置紫钻图标信息
			userinfo.getUserZZInfo(function(userinfo) {
				var _html = '<a href="http://vip.yy.com/vip/redirect?src=pay.yyvip" target="_blank"><i class="icon-show-gray"></i></a>';
				if (userinfo.data && userinfo.data.info && userinfo.data.info.vipUser) {
					_html = '<i class="icon-show-v' + userinfo.data.info.vipGrade + '"></i>';
				}
				$('#iconPurple').replaceWith(_html);
			});



			$(".user-profile-login-div").html(content).show();
			var growthContent = template("user-profile-growth-info", info.data.info);
			//设置当前成长值
			$(".grow-progress__value_bg span").text(info.data.info.score);
			$(".user-profile").after(growthContent);
			$(".user-profile-nologin-div").hide();
			if (info.data.info.vipUser) {
				//根据level设置高亮列
				$.each($("#tb-1vip-privilege tr"), function(i, v) {
					var level = info.data.info.vipLevel;
					if (i == 1) {
						level++;
					}
					$(this).find("td").eq(level).addClass('current');
				});
				$(".grow-progress__list li:lt(" + (info.data.info.vipLevel - 1) + ")").map(function() {
					$(this).addClass('highlight');
				});
				$(".grow-progress__list li:eq(" + (info.data.info.vipLevel - 1) + ")").addClass('current');
				$("#vipIncPerDay").html("+" + info.data.info.incPerDay);
				//根据成长值，计算进度条
				resetGrowValue(info.data.info.score);
				//获取会员年费区间
				getPeriod();
				//显示会员特权面板
				$(".user-privilege-wrap").html(template("user-privilege-tpl",info.data.info)).show();
				//获取广告
			}
		};
		userinfo.getUserLogo(function(logo) {
			$(".user-profile__pic img").attr("src", logo);
		});

		//载入个人中心广告20074
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=20074",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if(rsp.result){
					$(".user-profile-adv").attr("href",rsp.data[0].url).text(rsp.data[0].desc);
				}
			}
		});
	});

	$("#user-profile-nologin").click(function() {
		showUdbLogin();
	});
	$(".p-s1").on('click', 'a', function() {
		var lineCount = $("#growth-table").data("line-count");
		if (lineCount <= 1) {
			$(this).toggleClass('expand');
			return;
		}
		if ($(this).hasClass('expand')) {
			$("#growth-table-wrap").animate({
				height: 42 + 44 + 1 + 'px'
			});
			$(this).removeClass('expand');
		} else {
			$("#growth-table-wrap").animate({
				height: 42 + lineCount * 44 + 'px'
			});
			$(this).addClass('expand');
		}

	});
	$.ajax({
		url: '/service/web/user/scoreHistory',
		cache: false,
		dataType: 'json',
		success: function(rsp) {
			if (rsp.result) {
				var content = template("growth-history", rsp.data);
				$("#growth-table tbody").html(content);
				$("#growth-table").data("line-count", rsp.data.historyList.length);
				if (rsp.data.historyList.length > 0) {
					$("#growth-table-wrap").height(86 + 1);
				};
			}
		}
	});



	//载入顶部广告
	/*(function loadleft() {
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=10101",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				var source = '<a class="mod-axd" href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a>' + '<div class="mod-axd-bar"><span class="dot-left"></span></div>';
				var render = template.compile(source);
				if (rsp.data != null) {
					$('#procductWrap').html(render(rsp.data));
				}
			}
		});
	})();*/

	//载入中部广告
	
	/*(function loadCenter() {
		$.ajax({
			url: "http://vip.yy.com/vip/ad?adNo=10402",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if (rsp.data != null) {
					$(".user-profile__adv1").html('<a href="' + rsp.data.url + '" target="_blank">' + rsp.data.desc + '</a>');
				}
			}
		});
	})();*/
	
	//增加一个微信二维码广告
	$(document).ready(function(){
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=12001&adNo=10101&adNo=10402",
			type: 'GET',
			async:true,
			cache: true,
			dataType: 'jsonp',
			success: function(rsp){
				var alldata = rsp.data;
				var data = null;
				
				if(rsp.result && rsp.data){
					if(alldata["12001"]){
						data = alldata["12001"][0];
						$("#weixidoublecode").append('<a href="' + (data["url"] ? data["url"] : "javascript:;") + '" style="display:block;" target="_blank"><img  style="display:block;" alt="' + data["desc"] + '" title="' + data["desc"] + '" src="' + data["images"] + '" /></a>');	
					}
					
					if(alldata["10101"]){
						data = alldata["10101"][0];
						var source = '<a class="mod-axd" href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a>' + '<div class="mod-axd-bar"><span class="dot-left"></span></div>';
						var render = template.compile(source);
						$('#procductWrap').html(render(data));
					}
					if(alldata["10402"]){
						data = alldata["10402"][0];
						$(".user-profile__adv1").html('<a href="' + data.url + '" target="_blank">' + data.desc + '</a>');
					}
				}
			}
		});
	});
});