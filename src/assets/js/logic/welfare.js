define(function(require, exports, module){
	var userinfo = require("../mod/login.js");
	var $ = jQuery = require("../lib/jquery.min.js");
	var template = require("../lib/template.min.js");
	var baseService = "/service/web/welfare/";
	require('../mod/header');
	require('../mod/ajaxhelper');

	var dialog = require("../mod/dialog/dialog");
	function showMsgBox(content) {
		dialog.showMsgBox(content);
	}
    function showPopup(option){
    	option.id = "dialogPopupBox";
    	option.skin = "ui-dialog-skin-vip";
    	var _dialog = dialog.get('dialogPopupBox');
    	if (!_dialog) {
            dialog(option).showModal();
        } else {
            _dialog.content(option.content).showModal();
        }
    }

    // 回到顶部
	$(".welfare-nav").on("click","a",function(){
		$(this).siblings('a').removeClass("select-nav");
		var target = $(this).data("href");
		if(target != undefined){
			$('html,body').animate({scrollTop:$("#"+target).offset().top},500);
		}
	});

	userinfo.getUserInfo(function(info) {
		console.log('****** userinfo *****');
		console.log(info);
		// $(".welfare-p-info").html(template("vip-info",info));
		$('.welfare-p-info').html(require('../tpl/welfare/vip-info')({info}));
		userinfo.getUserLogo(function(logo) {
			$(".welfare-p-info .info-logo").attr("src", logo);
		});
	});

	$("body").delegate('.login-btn','click',function(){
		var target_btn = this;
		userinfo.getUserInfo(function(info){
			if(info.result && info.data != null){
				$(target_btn).trigger("login-click");
			}
			else{
				showUdbLogin();
			}
		});
	}).delegate('.goto-left','click',turnLeft).delegate('.goto-right','click',turnRight)
	.delegate('.welfare-btn', 'login-click', welfareBtnClick)
	.delegate('.not-love-a','login-click',love)
	.delegate('.do-lucky','login-click',luckyClick)
	.delegate('.statis-a','click',statis);

	function statis(){
		var pid = $(this).closest("li").data("pid");
		$.ajax({
			url:baseService+'statisticClickNum',
			cache:false,
			data:{id:pid},
			dataType:'json',
			success:function(rsp){
				return true;
			}
		});
	}

	function welfareBtnClick(){
		var flag = $(this).data("flag");
		//0试试手气
		//1限时兑换
		//2限量兑换
		if (flag == 0) {
			doLucky($(this).data("lottery"),this);
			return ;
		}
		else if(flag == 1){
			exchangeProduct($(this).closest('li').data("pid"),0,this);
		}
		else if(flag == 2){
			exchangeProduct($(this).closest('li').data("pid"),1,this);
		}
		else if(flag == 3){
			$(this).addClass('welfare-btn-2');
			return ;
		};
	}

	function exchangeProduct(pid,type,context){
		$.ajax({
			url: baseService+"exchangeProduct",
			dataType: "json",
			data: {productId: pid,type:type},
			cache: false,
			context:{maskId:context},
			success: function(rsp){
				if(checkNotVip(rsp)){
					return ;
				}
				if(rsp.result){
					showPopup({
						content:rsp.desc,
						okValue:'前往兑换',
						ok:function(){
							window.open(rsp.data.activeUrl,"_blank");
						}
					});
					if(type == 1){
						$(context).closest("li").find(".welfare-left-num").html(rsp.data["leftNum"]);
						updateLeftV(rsp.data["beanNum"]);
					}else{
						updateLeftV(rsp.data["beanNum"]);
					}
				}
				else{
					showMsgBox(rsp.desc);
				}
			}
		});
	}

	function doLucky(pid,context){
		$.ajax({
			url: baseService+"doLottery",
			dataType: "json",
			data: {lotteryId: pid},
			cache: false,
			context:{maskId:context},
			success: function(rsp){
				if(checkNotVip(rsp)){
					return ;
				}
				showMsgBox(rsp.desc);
				if(rsp.data){
					updateLeftV(rsp.data);
				}
			}
		});
	}
	function luckyClick(){
		doLucky($(this).data("flag"),this);
	};

	//更新剩余的V豆数量
	function updateLeftV(count){
		$("#v-left-count").html(count);
	}

	$(document).ready(function(){
		//请求页面初始化信息，剩余v豆，
		$.ajax({
			url:baseService+'initInfo',
			cache:false,
			dataType:'json',
			success:function(rsp){
				$("#v-left-count").html(rsp.data.beanNum);
			}
		});
		//加载兑换的物品
		$.ajax({
			url:baseService+'exchangeInfo',
			cache:false,
			dataType:'json',
			success:function(rsp){
				$(".v-exchange-time-wrap").append(template("tpl-time-list", rsp.data)).find(".loading").remove();
				$(".v-exchange-count-wrap").append(template("tpl-count-list", rsp.data)).find(".loading").remove();
				runLeftTimeUpdate();
				console.log('************ 加载兑换的物品 *************');
				console.log(rsp.data);
			}
		});
		//加载抽奖的物品
		$.ajax({
			url:baseService+'lotteryInfo',
			cache:false,
			dataType:'json',
			success:function(rsp){
				$(".v-roll-area").append(template("tpl-lucky-list", rsp.data)).find(".loading").remove();
				// $(".lucky-table").append(template("tpl-dialy-lucky-list", rsp.data)).prev(".loading").remove();
				$(".lucky-table").append(require('../tpl/welfare/dialyLuckyList')(rsp.data)).prev(".loading").remove();
			}
		});
		//请求广告信息
		$.ajax({
			url: "http://vip.yy.com/vip/ad?adNo=20066",
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				$(".welfare-adv").html('<a href="'+rsp.data.url+'" target="_blank"><img width="730" height="180" src="'+rsp.data.images+'"/></a>');
			}
		});
	});

    var isTurningLeft = false,isTurningRight = false;
//列表右移
	function turnRight(){
		if(isTurningLeft || isTurningRight){
			return ;
		}
		isTurningRight = true;
		var targetUl = $(this).prev("div").find("ul");
		var leftOffset = parseInt(targetUl.find("li").css("margin-left"))*2+targetUl.find("li").width();
		targetUl.append(targetUl.find("li").first().clone());
		targetUl.animate({
			"margin-left": "-"+leftOffset+"px"
		},500,function(){
			targetUl.removeAttr('style');
			targetUl.find("li").first().remove();
			isTurningRight = false;
		});
	}
//列表左移
	function turnLeft(){
		if(isTurningLeft || isTurningRight){
			return ;
		}
		isTurningLeft = true;
		var targetUl = $(this).next("div").find("ul");
		var leftOffset = parseInt(targetUl.find("li").css("margin-left"))*2+targetUl.find("li").width();
		targetUl.prepend(targetUl.find("li").last().clone());
		targetUl.css("margin-left","-"+leftOffset+"px");
		targetUl.animate({
			"margin-left": 0
		},500,function(){
			targetUl.removeAttr('style');
			targetUl.find("li").last().remove();
			isTurningLeft = false;
		});
	}

	$(".v-make-container").bind("login-click",function(){
		switch($(this).data("flag")){
			case 1:dialySign();break;
			case 2:getEveryweekBean();break;
			case 3:vIcon();break;
			case 4:openVip(0);break;
			case 5:openVip(1);break;
		}
	});

	//每日签到
	function dialySign(){
		$.ajax({
			url:baseService+'signEveryDay',
			cache:false,
			dataType:'json',
			success:function(rsp){
				if(rsp.code == -1){
					showPopup({
						content:rsp.desc,
						okValue:'立即签到',
						ok:function(){
							window.open("http://vip.yy.com/vzone/mood/index","_blank");
						}
					});
				}
				else{
					showMsgBox(rsp.desc);
				}
			}
		});
	}
	//每周领取
	function getEveryweekBean(){
		$.ajax({
			url:baseService+'getEveryweekBean',
			cache:false,
			dataType:'json',
			success:function(rsp){
				if(checkNotVip(rsp)){
					return ;
				}
				showMsgBox(rsp.desc);
			}
		});
	}
	//访问V图标
	function vIcon(){
		$.ajax({
			url:baseService+"lotteryBean",
			cache:false,
			dataType:'json',
			success:function(rsp){
				showMsgBox(rsp.desc);
			}
		});
	}
	//充值会员//赠送会员
	function openVip(flag){
		$.ajax({
			url: baseService+"isFirstRecharge",
			dataType: "json",
			cache: false,
			data: {type: flag},
			async: false,
			success: function(rsp){
				if(rsp.result){
					switch(rsp.code){
						case 0:
							if(flag == 0){
								window.open("http://vip.yy.com/vip/vmall2/vipWelfare1");
							}else{
								window.open("http://vip.yy.com/vip/vmall2/vipWelfare2");
							}
							return ;
						default:
							if(flag == 0){
								showPopup({
									content: rsp.desc,
									ok: function(){
										window.open("http://vip.yy.com/vip/vmall2/vipWelfare1");
									},
									okValue: "继续充值"
								});
							}else{
								showPopup({
									content: rsp.desc,
									ok: function(){
										window.open("http://vip.yy.com/vip/vmall2/vipWelfare2");
									},
									okValue: "继续赠送"
								});
							}
							return;
					}
				}
				showMsgBox(rsp.desc);
			}
		});
	}

	//喜欢某奖品
	function love(){
		var $this = $(this);
		$.ajax({
			url:baseService+"loveIt",
			data:{productId:$this.closest('li').data("pid")},
			dataType:'json',
			cache:false,
			context:{maskId:this},
			success:function(rsp){
				if(rsp.result){
					$this.removeClass().addClass('active');
				}
				else{
					showMsgBox(rsp.desc);
				}
			}
		});
	}

	function getDate(seconds){
		if(seconds == 0){
			return "-";
		}
		var dt = new Date(seconds);
		if(dt == null){
			return "-";
		}
		return dt.getFullYear()+"-"+formatDate(dt.getMonth()+1)+"-"+formatDate(dt.getDate())+" "
		+formatDate(dt.getHours())+":"+formatDate(dt.getMinutes())+":"+formatDate(dt.getSeconds());
	};
	
	function formatDate(dt){
		if(dt < 10){
			return "0"+dt;
		}
		return dt;
	}

	//V豆详情
	function bearRecord(){
		$.ajax({
			url:baseService+'getBeanRecordList',
			cache:false,
			dataType:'json',
			context:{maskId:this},
			success:function(rsp){
				if(rsp.result){
					if(rsp.code == -3){
						showPopup({
							content:rsp.desc,
							okValue:'赚取V豆',
							ok:function(){
								$('html,body').animate({scrollTop:$("#v-make").offset().top},500);
							}
						})
						return false;
					}
					var html = [];
					html.push('<div class="table-s1"><table></tr><th>操作</th><th>赚取/消耗</th><th>剩余</th><th>时间</th><th>有效期至</th></tr>');
					for(var i=0, len=rsp.data.length; i<len; i++){
						if(rsp.data[i]["beanNum"] > 0){
							rsp.data[i]["beanNum"] = '+'+rsp.data[i]["beanNum"];
						}
						if(rsp.data[i]["effitiveTime"] == 0){
							rsp.data[i]["remainNum"] = "-";
						}
						html.push('<tr><td>' + rsp.data[i]["beanSource"] + '</td><td>' + rsp.data[i]["beanNum"]+ '</td><td>' + rsp.data[i]["remainNum"] + '</td><td>' + getDate(rsp.data[i]["times"] * 1000) + '</td><td>' + getDate(rsp.data[i]["effitiveTime"] * 1000) + '</td></tr>');
					}
					html.push('</table></div>');
					showPopup({
							content:html.join(""),
							okValue:'赚取更多V豆',
							ok:function(){
								$('html,body').animate({scrollTop:$("#v-make").offset().top},500);
							}
						})
				}else{
					showMsgBox(rsp.desc);
				}
			}
		});
	}
	$(".v-detail").bind('login-click',bearRecord);

	//我的礼品
	function giftRecord(){
		$.ajax({
			url:baseService+'prizeRecord',
			cache:false,
			dataType:'json',
			context:{maskId:this},
			success:function(rsp){
				if(rsp.result){
					if(rsp.code == -3){
						showPopup({
							content:rsp.desc,
							okValue:'赚取V豆',
							ok:function(){
								$('html,body').animate({scrollTop:$("#v-make").offset().top},500);
							}
						})
						return false;
					}
					var lotteryPrizes = rsp.data.lotteryPrizes;
					var exchangePrizes = rsp.data.exchangePrizes;
					var html = [];
					html.push('<div class="table-s1"><table></tr><th>获得方式</th><th>礼品</th><th>时间</th><th>兑换码</th><th>兑换地址</th><th>兑换码有效期</th></tr>');
					if(lotteryPrizes != null){
						for(var i=0, len=lotteryPrizes.length; i<len; i++){
							html.push('<tr><td>V豆抽奖</td><td>' + lotteryPrizes[i]["prizeName"] + '</td><td>' + lotteryPrizes[i]["times"] + '</td><td>' + lotteryPrizes[i]["activeKey"] + '</td><td><a href="' + lotteryPrizes[i]["activeKeyLink"] + '" target="_blank" >点这里&raquo;</a></td><td>' + lotteryPrizes[i]["expireTime"] + '</td></tr>');
						}
					}
					if(exchangePrizes != null){
						for(var i=0, len=exchangePrizes.length; i<len; i++){
							html.push('<tr><td>V豆兑换</td><td>' + exchangePrizes[i]["prizeName"] + '</td><td>' + exchangePrizes[i]["times"] + '</td><td>' + exchangePrizes[i]["activeKey"] + '</td><td><a href="' + exchangePrizes[i]["activeKeyLink"] + '" target="_blank" >点这里&raquo;</a></td><td>' + exchangePrizes[i]["expireTime"] + '</td></tr>');
						}
					}
					html.push('</table><div>');
					showPopup({
						content:html.join("")+"<br/><br/>"
					})
				}else{
					showMsgBox(rsp.desc);
				}
			}
		});
	}
	$(".v-my-gift").bind('login-click',giftRecord);

	//更新限时区域剩余时间
	function runLeftTimeUpdate(){
		$("span.welfare-left-time").each(function(){
			var leftTime = $(this).data("time");
			//如果时间超过今天，那么显示距离今晚23:59:59分还有多少时分秒
			//否则显示距离结束还有多少时分秒
			var now = new Date();
			var todayLeftTime = (23 - now.getHours())*3600+(59-now.getMinutes())*60+(59-now.getSeconds());
			if(leftTime > todayLeftTime){
				leftTime = todayLeftTime;
				$(this).attr("data-time",leftTime);
			}
			if(leftTime <= 0){
				$(this).html("0时0分0秒");
			}
			else{
				$(this).html(parseInt(leftTime/3600)+"时"+parseInt(leftTime%3600/60)+"分"+(leftTime%3600%60)+"秒");
			}
		});
		var isAllLeftNone = true;
		var interval = setInterval(function(){
			isAllLeftNone = true;
			$("span.welfare-left-time").each(function(){
				var leftTime = $(this).attr("data-time");
				if(leftTime <= 0){
					$(this).html("0时0分0秒");
				}
				else{
					$(this).html(parseInt(leftTime/3600)+"时"+parseInt(leftTime%3600/60)+"分"+(leftTime%3600%60)+"秒");
					isAllLeftNone = false;
				}
				$(this).attr("data-time",(leftTime-1));
			});
			if(isAllLeftNone){
				clearInterval(interval);
				return ;
			}
		},1000);
	}

	$(document).ready(function(){
		require.async('http://yue.yy.com/common/js/yyutil.js');
		require.async('http://res.udb.duowan.com/js/oauth/udbsdk/proxy/udbsdkproxy.min.js');
		require.async('http://yue.yy.com/interface/subcribe.js');
	});

	function checkNotVip(rsp){
		if(!rsp.result && rsp.code == -1){
			showPopup({
				content:rsp.desc,
				okValue:'成为会员',
				ok:function(){
					window.open('http://vip.yy.com/vip/vmall2/vipWelfare1',"_blank");
				}
			})
			return true;
		}
		return false;
	}
});