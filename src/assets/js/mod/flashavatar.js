/*
 * 使用Flash圆形使头像变成圆形
 */
define(function(require, exports, module) {
	var $ = require('../lib/jquery.min.js');
	var swfobject = require("./swfobject.js");
	var flashId = "_flash_avatar_72x72_";
	var	flashVars = {},
		flashParams = {wmode:"transparent"},
		flashAttributes = {wmode:"transparent", style:"display:block;", play:true, id: flashId};
		
	
	
	module.exports = function(opt) {
		var options = {
		    moviePath:"/assets/flash/circle.swf",
		    size:72,
		    inflash:true,
		    imgUrl: "",
		    recordingUrl: "",
		    code: 0,
		    hasBigAvatar: 0
		  };
		
		options = $.extend(options, opt);
		
		function genHTML(id, imgUrl){
			  var html = '';
			  var isSup = typeof document.body.style.oBorderRadius !== "undefined" || typeof document.body.style.msBorderRadius !== "undefined" || typeof document.body.style.mozBorderRadius !== "undefined" || typeof document.body.style.webkitBorderRadius !== "undefined" || typeof document.body.style.borderRadius !== "undefined";
			  var $id = $("#" + id);
			  if(!isSup){
				  if($("#" + flashId).length == 0){
					  $id.html('<span id="' + flashId + '"></span>');
				  }
				  swfobject.embedSWF(options.moviePath + "?imgUrl=" + imgUrl, flashId, 72, 72, "9.0.0", "/js/mod/expressInstall.swf", flashVars, flashParams, flashAttributes);
			  }else{
				  $id.html('<img src="' + imgUrl + '" alt="头像" width="' + [options.size] + 'px" height="' + [options.size] + 'px"/>');
			  }
		  }
		  return {
			embedCircleAvatar: genHTML
		  };
	};
});