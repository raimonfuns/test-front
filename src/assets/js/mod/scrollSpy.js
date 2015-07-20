define(function(require, exports, module) {
	var scrollSpy = function(element) {
		this.$node = $(element).on("click", $.proxy(this.click, this));
		this.$anchor = this.$node.find('a');
		this.$first = this.$node.find('li:first').addClass("active")
		this.$win = $(window).on("scroll", $.proxy(this.spy, this));
	}
	scrollSpy.prototype = {
		constructor: scrollSpy,
		nodeTop: function(elem) {
			var id = elem.attr("href");
			var offset = 60;
			return $(id).offset().top - offset;
		},
		click: function(e) {
			var t = this;
			if (e.target.nodeName == "A") {
				$('html, body').stop().animate({
					scrollTop: t.nodeTop($(e.target))
				}, 500);
			}
			e.preventDefault();
		},
		spy: function() {
			var t = this;
			var scrollTop = this.$win.scrollTop();
			for (var i = 0, len = this.$anchor.length; i < len; i++) {
				var sect = $(this.$anchor[i]);
				var top = t.nodeTop(sect);
				if (scrollTop > top - 10) {
					this.$anchor.parent().removeClass("active");
					sect.parent().addClass("active");
				}
			}
		}
	}

	module.exports = scrollSpy;

});