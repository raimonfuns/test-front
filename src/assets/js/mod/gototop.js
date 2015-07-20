/*
 * @import jQuery.js
 * 
 * @namespace jQuery
 * 
 * @method gotoTop
 * 
 * @param {Boolean} isCurrentTop : 如果为true表示将以当前元素的可见性为基础，否则以当前窗口可见性为基础
 * @param {Number} ie6TimeInterval 因为在ie6不技持position:fixed所以，在滚动停止多长时间后，将返回按钮以动画效果重新定位，设置停止多长时间后重定位
 * @param {Boolean} isAnyTimeFixed 是否由始至终都显示在当前位置，而不隐藏，true为不隐藏，false为在顶部时隐藏
 * @param {Function} addContentFunction 调用这函数，必须返回HTML字符串或 jQuery实例，并将其插入到当前的返回顶部按钮上
 * @param {Object} offsetMiddleSet 设置跟当前显示位置的偏移量，黙认不偏移，可以百分比，此时是相对于浏览器窗口的
 * 
 * @description: 返回顶部
 * 
 * @return {jQuery Object}
 * 
 * @example
 * 		jQuery("#gotoTop").gotoTop();
 * 
 */
"use strict";
define(function(require, exports, module){
	var percentReg = /^[0-9\.]+%$/;
	
	function _gototop_(isCurrentTop, ie6TimeInterval, isAnyTimeFixed, addContentFunction, offsetMiddleSet){
		
		ie6TimeInterval = ie6TimeInterval || 400;
		isAnyTimeFixed = ( typeof isAnyTimeFixed === "undefined" || !isAnyTimeFixed ) ? false : true;
		offsetMiddleSet = typeof offsetMiddleSet === "object" ?  $.extend({left:0, top:0}, offsetMiddleSet) : {left:0, top:0};
		
		//取得当前需要一个返回顶部的元素的是jQuery对象
		var $this = jQuery(this),
			//取得当前窗口的一个jQuery对象
			$window = jQuery(window),
			//当前元素的宽度
			thisWidth, 
			//当前元素的顶部离浏览器窗口顶部的距离
			thisTopHeight,
			//当前元素的左边离浏览器窗口左边的距离
			thisLeftWidth, 
			//当前浏览器窗口的宽度
			windowHeight,
			//取当前元素的相对于窗口左上角的距离坐标
			thisOffset = $this.offset(),
			//保存当前返回按钮是否已经显示，默认为不显示
			isHasShow = false,
			//保存当前浏览器是否为IE 6
			isIE6 = /MSIE 6/.test(window.navigator.userAgent),
			//保存在ie6的clearTimeout
			ie6ClearTimeout,
			//按钮元素的高度
			buttonHeight, 
			//按扭元素离窗口顶部的距离
			buttonTopHeight,
			//返回按钮的HTML代码
			$button = jQuery('<span style="position:fixed; height:45px; width:45px; display:none;">'+
					'<a style="display:block; overflow:hidden; background:#D6090D url(http://dl3.vip.yystatic.com/yyvippicture/a325fd6865fd00f756b817d4432e7aa1.png) no-repeat; height:45px; width:45px; text-decoration:none; cursor:pointer;" href="javascript:;">'+
					'</a>'+
				'</span>'),
			//保存真正的返回按钮
			$realGoBack = $button.children("a");
			
		isIE6 ? $button.css({position:"absolute"}): "";
		isAnyTimeFixed ? $button.css({display:"block"}) : $realGoBack = $button;
		typeof addContentFunction === "function" ?  $button.append(addContentFunction()) : ""; 
		
		$button.appendTo(this.ownerDocument.body);
		thisTopHeight = isCurrentTop ? thisOffset.top : 0;
		thisLeftWidth = thisOffset.left;
		thisWidth = $this.outerWidth();
		windowHeight = $window.height();
		buttonHeight = $button.outerHeight();
		
		buttonTopHeight = (windowHeight - buttonHeight) / 2;
		
		//重加自定义距离
		if(percentReg.test(String(offsetMiddleSet.top))){
			buttonTopHeight  = buttonTopHeight + parseInt(offsetMiddleSet.top, 10)/100 * windowHeight;
		}else{
			buttonTopHeight  = buttonTopHeight + offsetMiddleSet.top;
		}
		if(percentReg.test(String(offsetMiddleSet.left))){
			thisLeftWidth = thisLeftWidth + parseInt(offsetMiddleSet.left, 10)/100 * thisLeftWidth * $window.width();
		}else{
			thisLeftWidth = thisLeftWidth + offsetMiddleSet.left;
		}
		
		
		$button.css({top: buttonTopHeight + "px", left:(thisLeftWidth + thisWidth) + "px"});
		
		//当浏览器发生滚动时事件
		$window.scroll(function(){
			var scrollTopHeight = $window.scrollTop();
			if(scrollTopHeight > thisTopHeight){
				if(!isHasShow){
					$realGoBack.fadeIn("fast");
					isHasShow = true;
				}
				if(isIE6){
					window.clearTimeout(ie6ClearTimeout);
					ie6ClearTimeout = setTimeout(function(){
						$button.animate({top: (scrollTopHeight + buttonTopHeight)}, "fast");
					}, ie6TimeInterval);
					
				}
			}else{
				if(isHasShow){
					$realGoBack.fadeOut("fast");
					isHasShow = false;
				}
			}
		});
		
		//当浏览器发生大小改变时动作
		$window.resize(function(){
			windowHeight = $window.height();
			thisLeftWidth = $this.offset().left;
			buttonTopHeight = (windowHeight - buttonHeight) / 2;
			
			//重加自定义距离
			if(percentReg.test(String(offsetMiddleSet.top))){
				buttonTopHeight  = buttonTopHeight + parseInt(offsetMiddleSet.top, 10)/100 * windowHeight;
			}else{
				buttonTopHeight  = buttonTopHeight + offsetMiddleSet.top;
			}
			if(percentReg.test(String(offsetMiddleSet.left))){
				thisLeftWidth = thisLeftWidth + parseInt(offsetMiddleSet.left, 10)/100 * thisLeftWidth * $window.width();
			}else{
				thisLeftWidth = thisLeftWidth + offsetMiddleSet.left * thisLeftWidth;
			}
			
			$button.css({top: buttonTopHeight + "px", left:(thisLeftWidth + thisWidth) + "px"});
		});
		
		//返回到顶部的相关事件
		$button.click(function(){
			$window.scrollTop(thisTopHeight);
		});
	}
	
	exports.active = function(element, option){
		_gototop_.apply(element, [option.isCurrentTop, option.ie6TimeInterval, option.isAnyTimeFixed, option.addContentFunction, option.offsetMiddleSet]);
	}
});