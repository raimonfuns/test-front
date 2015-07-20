define(function(require, exports, module) {
		var $ = jQuery = require("../../lib/jquery.min.js");

		require('../../mod/header');
		require('../../mod/screenWatch');

		var template = require('../../lib/template.min.js');


		var _navItemTpl = '<li><a href="#{{target}}" data-set-target="{{target}}" >{{name}}</a></li>';
		$title = $("#scrollfixed span");
		$("#aboutcontent").find('li').each(function(index, e) {
			var _html = '';
			var $this = $(e);
			$this.find("a[name]").each(function() {
				var $this = $(this);
				_html += template.compile(_navItemTpl)({
					target: $this.attr("name"),
					name: $.trim($this.next().text())
				});

			});


			$($('#privNav').find('.side-menu__sub')[index]).html(_html);

		});

		var fixAside = function(element, offset) {

			this.$node = $(element);
			this.pos = this.$node.offset();
			this.offset = parseInt(offset);
			this.$win = $(window).on('scroll', $.proxy(this.checkPos, this));
			this.checkPos();
		}
		fixAside.prototype = {
			constructor: fixAside,
			checkPos: function() {
				var t = this;
				var scrollTop = this.$win.scrollTop();
				if (scrollTop + this.offset > this.pos.top) {
					this.$node.addClass("fixed");
				} else {
					this.$node.removeClass("fixed");
				}
			}
		}
		new fixAside("#privNav", 10);

		var scrollSpy = function(element, type,target) {
			this.$node = $(element).on("click", $.proxy(this.click, this));
			this.$anchor = this.$node.find('a[data-set-target]');
			this.$win = $(window).on("scroll", $.proxy(this.spy, this));
			if(type && /^[0-3]$/.test(type)){				
				$($(element).children('li')[type]).find('a[data-set-target]').first().trigger('click');
			}else if (target && target != '') {
				this.$node.find('a[data-set-target=na'+target.substring(1)+']').trigger('click');
			} else {			
				$(element).find('li').first().addClass('current');
			}
			this.spy();
		}
		scrollSpy.prototype = {
			constructor: scrollSpy,
			nodeTop: function(elem) {
				var name = elem.attr("href");
				var offset = 0;
				return $("#aboutcontent").find('a[name=' + (name.substring(name.indexOf('#') +1 )) + ']').offset().top - offset;
			},
			click: function(e) {
				var t = this;
				if (e.target.nodeName == "A") {
					if ($(e.target).data('set-target')) {
						$('html, body').stop().animate({
							scrollTop: t.nodeTop($(e.target))
						}, 0);
					} else {
						$(e.target).siblings('.side-menu__sub').find('a').first().trigger('click');
					}
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
						this.$anchor.parent('li').removeClass("current");
						sect.parent('li').addClass("current").parent('ul.side-menu__sub').parent('li').addClass('current').siblings('li').removeClass('current');
					}
				}
			}
		}


      	var _type, _r = window.location.search.substr(1).match(/(^|[&|?])type=([^&]*)(&|$)/);     
        if(_r!=null)_type = unescape(_r[2]);

		var sSpy = new scrollSpy("#privNav", _type, window.location.hash);

		var goToTop = require("../../mod/gototop");
			goToTop.active($(".col-main").get(0), {offsetMiddleSet: {left: 90}});


});