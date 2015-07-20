define(function(require, exports, module){
	var $ = jQuery = require("../lib/jquery.min.js");
	var template = require("../lib/template.min.js");
	var data = {
		list: ['a', 'b', 'c']
	};
	$(document).ready(function () {
		console.log(template('tpl-mainslide', data));
		$('body').append(template('tpl-mainslide', data));
		// $('body').append('<h2>raimonfuns</h2>');
	});
}); 