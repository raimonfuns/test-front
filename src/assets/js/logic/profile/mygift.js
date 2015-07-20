define(function(require, exports, module) {
	require('../../mod/header');
	var $ = jQuery = require("../../lib/jquery.min.js");
	var template = require("../../lib/template.min.js");

	function getDate(dt){
		var dt = new Date(dt);
		return dt.getFullYear()+"-"+formatDate(dt.getMonth()+1)+"-"+formatDate(dt.getDate());
	};
	
	function formatDate(dt){
		if(dt < 10){
			return "0"+dt;
		}
		return dt;
	}
	//我的礼包
	$.ajax({
		url: '/service/web/user/getUserGoodsPacket',
		cache: false,
		dataType: 'json',
		success: function(rsp) {
			if (rsp.result) {
				if(rsp.data != null && rsp.data.length > 0){
					for(var i=rsp.data.length -1; i>=0;i--){
						rsp.data[i].beginTime = getDate(rsp.data[i].beginTime);
						rsp.data[i].endTime = getDate(rsp.data[i].endTime);
					}
					var content = template("gift-list", rsp);
					$(".tb-general_gift").append(content);
				}
				else{
					$(".no-gift-tips").show();
				}
			}
		}
	});

	//载入广告
	;(function loadleft() {
		$.ajax({
			url: "http://vip.yy.com/vip/ad?adNo=10101",
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				var source = '<a class="mod-axd" href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a>' + '<div class="mod-axd-bar"><span class="dot-left"></span></div>';
				var render = template.compile(source);
				if(rsp.data != null){
					$('.user-profile-ad1').html(render(rsp.data));
				}
			}
		});
	})()

});