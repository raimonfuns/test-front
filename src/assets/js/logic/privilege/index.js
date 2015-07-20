define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");


	var Slide = require('../../aralejs/slide');
	
	var edt = require("../../mod/edt.js");
	
	require('../../mod/header');
	
	require('../../mod/loginSider');

	require('../../mod/screenWatch');

	var slide;
	function slider() {
			slide = new Slide({
			element: '#slideS1',
			duration: 300,
			effect: 'scrollx',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers:false,
			triggers: ".ui-switchable-trigger",
			activeTriggerClass: 'active'
		}).render();
	}
	slider();



	var LoginInfo = require('../../mod/login');
	LoginInfo.getUserInfo(function(userinfo) {

		$('#loginArea').html( require('../../tpl/output/loginHder')(userinfo));
	});
	
	
	//注册对应的广告初始化完成回调
	edt.regist([{pid:8,nullRemove:true,complete:function(pid,obj){
			 
		if(obj){
			 var li_switchable = '<li class="ui-switchable-trigger">99</li>';
			 $(".ui-switchable-nav").append(li_switchable);
		}

		slide.destroy();
		slide = null;

		slider();
	}}]);
	edt.init();

});