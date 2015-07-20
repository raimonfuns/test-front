define(function(require, exports, module) {
	var $ = jQuery = require("../lib/jquery.min.js");
	//var template = require("../lib/template.min.js");
	var fixAside = require("../mod/fixAside.js");


	function loadAdsContent(callBack) {
		 $.ajax({
			url: "http://hd.vip.yy.com/1503y8/getLatestChannelInfo",
			//Uncaught ReferenceError: callback is not defined
			type: 'GET',
			async:true,
			cache: false,
			dataType: 'jsonp',
			success: callBack
		});
	}

	loadAdsContent(function(ret){
		if(ret.result){
			var _html = '<div id="asidead" style="position: fixed;top:200px;right:0;width:159px;height:252px;font-family: Microsoft YaHei,Apple LiGothic Medium,SimHei, LiSong Pro Light,SimSun;">'
			+ '<div style="margin-left:30px;"><img src="'+ ret.data.logoUrl+'" alt="头像" style="width:100px;height:100px;"/></div>'
			+ '<div style="width:159px;height:252px;position:absolute;top:0;left:0;background:transparent url(http://file.do.yy.com/group3/M00/5A/9C/tz0GSFUeUPOAfjYEAAAk-rFdi1E904.png) no-repeat 0 0;font-size:14px;color: #fff;font-family: "Microsoft YaHei","Apple LiGothic Medium","SimHei", "LiSong Pro Light","SimSun";">'
			+ '<p style="margin-top:164px;margin-left:20px;width:110px;text-align:center;height:18px;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;">主播<span style="color:#eef66c">' + ret.data.name + '</span></p>'
			+ '<p style="margin-left:20px;width:110px;height:18px;text-align:center;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;">给大家发红包</p>'
			+ '<a target="_blank" style="display:block;margin:10px 0 0 29px;text-align:center;width:102px;height:25px;border-bottom:5px solid #d0db17;background-color:#eef66c;text-align:cener;line-height:30px;" href="'+ ret.data.url+'">点击领取</a>'
			+'</div></div>'
			$('body').append(_html);
			new fixAside("#asidead", 0);
		}
	});


	//

});