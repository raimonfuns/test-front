define(function(require, exports, module) {
	//var callbacks = $.Callbacks();
	var $ = jQuery = require("../lib/jquery.min.js");
	var cookie = require("../mod/jquery.cookie.js")
	
	var cookieViewInfoMaxIdKey = 'VIEW_INFO_MAX_ID';
	var cookieViewInfoMaxIdValue = $.cookie(cookieViewInfoMaxIdKey);
    var hasNewInfo = false;
	var maxId;
	var hadRead =  false;
	var rtime = 30000;
	var ifHasNewInfo = function(callBack)
	{
		$.ajax({
		url: "/service/web/user/getMaxWebmailId",
		type: 'GET',
		cache: false,
		dataType: 'json',
		success: function(rsp) {

			/**************************/
			// console.log('----- /service/web/user/getMaxWebmailId -----')
			// console.log(rsp);
			/**************************/

			maxId = rsp["data"];
			
			if(hadRead)
			{   
				if(maxId>0) {
					$.cookie(cookieViewInfoMaxIdKey,maxId,{path: '/'}); // 要使得页面之间能够相互读取cookie，需要设置cookie顶级路径，cookie的路径用于设置能够读取cookie的顶级目录	
				}
				hadRead = false;
				return;
			}
			if(maxId>0){
				hasNewInfo = true;

				/**************************/
				// console.log('----- maxId -----')
				// console.log(maxId);
				// console.log('----- cookieViewInfoMaxIdValue -----')
				// console.log(cookieViewInfoMaxIdValue);
				/**************************/

				if(cookieViewInfoMaxIdValue)
					hasNewInfo = cookieViewInfoMaxIdValue >= maxId?false:true;
			}
			if (typeof callBack === "function") {
					callBack(hasNewInfo);
			}
			
		}
		});
	}
	
	//已读
	var readAll = function(callBack)
	{	
		hadRead = true;
		$('#vipHeaderCenterLink').hide(); 
		$('#vipHeaderMyinfoNotice').show();
		$('#vipHeaderMyinfoNotice').removeClass("selected");
	
	}
	
	var checkNewMyInfo = function(){
		
		ifHasNewInfo(function(flag) {
			
			if(flag == true)
			{	
				$('#vipHeaderCenterLink').hide();
				$('#vipHeaderMyinfoNotice').show();
				$('#vipHeaderMyinfoNotice').addClass("selected");
			}
			else{
				$('#vipHeaderCenterLink').hide();
				$('#vipHeaderMyinfoNotice').show();
				$('#vipHeaderMyinfoNotice').removeClass("selected");
			}
		});
	}
	
	
	var startCheck = function(){
		checkNewMyInfo();
		setInterval(checkNewMyInfo, rtime); // 间隔rtime（30000ms）检查一次是否有未读信息
	}
	exports.startCheck = startCheck;
	exports.checkNewMyInfo = checkNewMyInfo;
	exports.readAll = readAll;
	
});