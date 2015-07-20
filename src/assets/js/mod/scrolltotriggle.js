define(function(require, exports, module) {
	var $ = require("../lib/jquery.min");
		
	var toTopHeight = 0;
	var toBottomHeight = 0;
	var directive = "";
	var $win = $(window);
	var $doc = $(window.document);
	var actionArray = [];
	var initalize = function(){
		var wHeight = $win.height();
		var dHeight = $doc.height();
		var newTopHeight = $win.scrollTop();
		
		if(newTopHeight > toTopHeight){
			directive = "down";
		}else if(newTopHeight > toTopHeight){
			directive = "up"
		}else{
			directive = "";
		}
		toTopHeight = newTopHeight;
		toBottomHeight = dHeight - wHeight - toTopHeight;
	};
	
	initalize();
	
	$win.scroll(function(){
		initalize();
		for(var i=0,len=actionArray.length; i<len; i++){
			actionArray[i].call({toTop: toTopHeight, toBottom: toBottomHeight, directive: directive});
		}
	});
	
	var _ScrollToTriggle_ = {
		addAction: function(action){
			if(typeof action !== "function"){
				return false;
			}
			for(var i=0,len=actionArray.length; i<length; i++){
				if(actionArray[i] === action ){
					return false;
				}
			}
			actionArray.push(action);
		}, 
		removeAction: function(action){
			var tempArray;
			if(typeof action !== "function"){
				return false;
			}
			for(var i=0,len=actionArray.length; i<length; i++){
				if(actionArray[i] === action ){
					continue;
				}
				tempArray.push = actionArray[i];
			}
			actionArray = tempArray;
		}
	}
	module.exports = _ScrollToTriggle_;
});