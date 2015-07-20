define(function(require, exports, module) {
	var userinfo = require("../../mod/login.js");
	var $ = jQuery = require("../../lib/jquery.min.js");
	var template = require("../../lib/template.min.js");
	require('../../mod/screenWatch');
	require('../../mod/header');

	$(
		"#growProgressPoints .grow-progress__points__item")
		.on(
			'mouseenter',
			function() {
				$(this)
					.addClass(
						'hover');
			});
	$(
		"#growProgressPoints .grow-progress__points__item")
		.on(
			'mouseleave',
			function() {
				$(this)
					.removeClass(
						'hover');
			});

	
	userinfo.getUserLogo(function(logo) {
		$(".user-profile__pic img").attr("src", logo);
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
				if(rsp.data != null){
					$('.user-profile-ad1').html(render(rsp.data));
				}
			}
		});
	})()
});