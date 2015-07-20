define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");

	var template = require("../../lib/template.min.js");
	var Slide = require('../../aralejs/slide');

	require('../../mod/screenWatch');

	require('../../mod/header');


	var slide;

	function slider() {
		slide = new Slide({
			element: '#slideS1',
			duration: 300,
			effect: 'scrollx',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers: false,
			triggers: ".ui-switchable-trigger",
			activeTriggerClass: 'active'
		}).render();
	}
	//slider();


	var _tab_nav = '{{each list as v i}}'　 +
		'<li {{if i == 0}}class="active"{{/if}} data-tabidx="{{i}}"><a href="javascript:;"><span class="nav-left"></span><span class="nav-right">{{v.desc}}</span></a></li>' +
		'{{/each}}';
	var _tab_content = '{{each list as v i}}'　 +
	'<a href="{{v.url}}" {{if i == 0}}style="z-index:1;"{{/if}}><img   src="{{v.images}}" alt="{{v.desc}}"/></a>' +
		'{{/each}}';



	var _tab_adno = 50069; //顶部tab广告
	var _slider_adno = 50070; //底部轮播广告

	//载入页面广告
	(function loadleft() {
		$.ajax({
			url: "http://vip.yy.com/vip/ads?adNo=" + _tab_adno + "&adNo=" + _slider_adno,
			type: 'GET',
			cache: false,
			dataType: 'jsonp',
			success: function(rsp) {
				if (rsp.data) {
					if (rsp.data[_tab_adno]) {
						$('#tabNav').html(template.compile(_tab_nav)({
							list: rsp.data[_tab_adno]
						}));

						$('#tabContent').html(template.compile(_tab_content)({
							list: rsp.data[_tab_adno]
						}));
					}
					if (rsp.data[_slider_adno]) {
						if (rsp.data[_slider_adno].length > 0) {
							$('#slideS1').html(template("tpl-mainslide", {
								list: rsp.data[_slider_adno]
							}));
							slider();
						}
					}
				}
			}
		});
	})();

	$('#tabNav').on('click', 'li', function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		var _idx = $(this).data('tabidx');

		$($('#tabContent').find('a')[_idx]).css('z-index',1).siblings('a').css('z-index',0);
	});


});