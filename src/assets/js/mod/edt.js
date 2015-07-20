/***
 * 一点通平台广告处理
 * edt广告平台js
 * 在需要请求广告的地方加入tag即可
 * data-edt-pid 广告
 * data-edt-mode 0,纯图片,1,纯文字,2图片+文字
 * 附加 data-edit-show 表示加载数据的时候不占位,结束后才占位(可以忽略此属性)
 *
 */


define(function(require, exports, module) {
	var $ = jQuery = require("../lib/jquery.min.js");

	var LoginInfo = require('./login');
	var edtLoadFlag = false;
	var intFlag = false;
	require.async("../../js/edt.min.js",function(){
	//require.async("http://dl.vip.yy.com/assets/js/edt.js",function(){
      edtLoadFlag = true;
      commit();
    });
    
    function commit(){
    	if(!edtLoadFlag || !intFlag)
    		return;
    	var edt = new Edt();
      	edt.regist(options);
     	edt.init(pids,edtUserInfo.data.uid);
    	
    }
	
	
	var options;
	var pids;
	var edtUserInfo;
	exports.regist = function(_options){
		_options.nullRemove = true;
		options = _options;
		commit();
	}
	exports.init = function(_pids){
		LoginInfo.getUserInfo(function(userinfo) {
			if (!userinfo.result)
				userinfo.data = {
					uid: 0
				};
			edtUserInfo = userinfo;
			pids = _pids;
			intFlag = true;
			commit();
		});
	}
});