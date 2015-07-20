define(function(require, exports, module) {
	var $ = require('../lib/jquery.min.js');
	exports.initPage = function(id, pageData, changePageFunc, param) {
		$(id).off().html(require('../tpl/output/pager.js')(pageData)).on('click', 'a', function() {
			if (!$(this).hasClass('current')) {
				param = param || {};
				param.currentPage = $(this).data('pageno');
				changePageFunc(param)
			}
		});

	}

});