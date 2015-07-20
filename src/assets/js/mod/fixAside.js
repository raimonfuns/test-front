define(function(require, exports, module) {	
	var fixAside = function(element, offset) {
		this.$node = $(element);
		this.pos = this.$node.offset();

		this.offset = parseInt(offset);
		this.$win = $(window).on('scroll', $.proxy(this.checkPos, this));
	}
	fixAside.prototype = {
		constructor: fixAside,
		checkPos: function() {
			var t = this;
			var scrollTop = this.$win.scrollTop();
			if (this.pos) {
				if (scrollTop + this.offset > this.pos.top) {
					this.$node.addClass("fixed");
				} else {
					this.$node.removeClass("fixed");
				}
			}
		}
	}

	module.exports = fixAside;
	
});	