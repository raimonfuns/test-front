define(function(require, exports, module) {
	var LoginInfo = require('./login');
	$('#loginSider').html('<div class="box" style="text-align:center;"><br/><br/><image src="http://dl3.vip.yystatic.com/yyvippicture/0bc6bca0cf7615f8c1d7cfdda5c5f016.gif" src="loading"/><br/><br/><p>努力加载用户信息......</p><br/><br/></div>');
	LoginInfo.getUserInfo(function(userinfo) {
		$('#loginSider').replaceWith(require('../tpl/output/loginSider')(userinfo));
		LoginInfo.getUserLogo(function(logo) {
			$('#userAvatar').attr('src', logo);
		});

		$('#loggedInRenewClose').on('click', function() {
			$(this).parent('.logged-in__renew').slideUp('fast');
		});

		var closeTimeOut = 0;
		//会员非紫钻给紫钻灰色图标加上链接
		$(".icon-show-gray").on("mouseover",function(){
			$(".not-purple-popup").css("visibility","visible");
			clearTimeout(closeTimeOut);
		}).on("mouseout",function(){
			clearTimeout(closeTimeOut);
			closeTimeOut = setTimeout(function(){
				$(".not-purple-popup").css("visibility","hidden");
			},1000);
		});
		$(".not-purple-popup").on("mouseover",function(){
			clearTimeout(closeTimeOut);
			$(".not-purple-popup").css("visibility","visible");
		}).on("mouseout",function(){
			clearTimeout(closeTimeOut);
			$(".not-purple-popup").css("visibility","hidden");
		});


		//填充紫钻图标信息
		LoginInfo.getUserZZInfo(function(userinfo) {
			var _html = '<a href="http://vip.yy.com/vip/redirect?src=pay.yyvip" target="_blank"><i class="icon-show-gray"></i></a>';
			if(userinfo.data && userinfo.data.info && userinfo.data.info.vipUser){
				_html = '<i class="icon-show-v' + userinfo.data.info.vipGrade + '"></i>';
			}
			$('#iconPurple').replaceWith(_html);
		});


		
	});
	
});