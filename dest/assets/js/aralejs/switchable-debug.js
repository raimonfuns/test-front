/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/aralejs/switchable-debug",["../lib/jquery.min-debug","../araleWidget/widget-debug","../araleBase/base-debug","../araleBase/class-debug","../araleBase/events-debug","../araleBase/aspect-debug","../araleBase/attribute-debug","../araleWidget/daparser-debug","../araleWidget/auto-render-debug","./plugins/effects-debug","./plugins/easing-debug","./plugins/autoplay-debug","./plugins/circular-debug"],function(a,b,c){function d(a,b,c,d){for(var e=f("<ul>"),g=0;a>g;g++){var h=g===b?c:"";f("<li>",{"class":h,html:g+1}).appendTo(e)}return d?e.children():e}function e(a){return{UI_SWITCHABLE:a||"",NAV_CLASS:a?a+"-nav":"",CONTENT_CLASS:a?a+"-content":"",TRIGGER_CLASS:a?a+"-trigger":"",PANEL_CLASS:a?a+"-panel":"",PREV_BTN_CLASS:a?a+"-prev-btn":"",NEXT_BTN_CLASS:a?a+"-next-btn":""}}var f=jQuery=a("../lib/jquery.min-debug"),g=a("../araleWidget/widget-debug"),h=a("./plugins/effects-debug"),i=a("./plugins/autoplay-debug"),j=a("./plugins/circular-debug"),k=g.extend({attrs:{triggers:{value:[],getter:function(a){return f(a)}},panels:{value:[],getter:function(a){return f(a)}},classPrefix:"ui-switchable",hasTriggers:!0,triggerType:"hover",delay:100,activeIndex:{value:0,setter:function(a){return parseInt(a)||0}},step:1,length:{readOnly:!0,getter:function(){return Math.ceil(this.get("panels").length/this.get("step"))}},viewSize:[],activeTriggerClass:{getter:function(a){return a?a:this.get("classPrefix")+"-active"}}},setup:function(){this._initConstClass(),this._initElement();var a=this._getDatasetRole();this._initPanels(a),this._initTriggers(a),this._bindTriggers(),this._initPlugins(),this.render()},_initConstClass:function(){this.CONST=e(this.get("classPrefix"))},_initElement:function(){this.element.addClass(this.CONST.UI_SWITCHABLE)},_getDatasetRole:function(){var a=this,b={},c=["trigger","panel","nav","content"];return f.each(c,function(c,d){var e=a.$("[data-role="+d+"]");e.length&&(b[d]=e)}),b},_initPanels:function(a){var b=this.get("panels");if(b.length>0||(a.panel?this.set("panels",b=a.panel):a.content&&(this.set("panels",b=a.content.find("> *")),this.content=a.content)),0===b.length)throw new Error("panels.length is ZERO");this.content||(this.content=b.parent()),this.content.addClass(this.CONST.CONTENT_CLASS),this.get("panels").addClass(this.CONST.PANEL_CLASS)},_initTriggers:function(a){var b=this.get("triggers");b.length>0||(a.trigger?this.set("triggers",b=a.trigger):a.nav?(b=a.nav.find("> *"),0===b.length&&(b=d(this.get("length"),this.get("activeIndex"),this.get("activeTriggerClass"),!0).appendTo(a.nav)),this.set("triggers",b),this.nav=a.nav):this.get("hasTriggers")&&(this.nav=d(this.get("length"),this.get("activeIndex"),this.get("activeTriggerClass")).appendTo(this.element),this.set("triggers",b=this.nav.children()))),!this.nav&&b.length&&(this.nav=b.parent()),this.nav&&this.nav.addClass(this.CONST.NAV_CLASS),b.addClass(this.CONST.TRIGGER_CLASS).each(function(a,b){f(b).data("value",a)})},_bindTriggers:function(){function a(a){c._onFocusTrigger(a.type,f(this).data("value"))}function b(){clearTimeout(c._switchTimer)}var c=this,d=this.get("triggers");"click"===this.get("triggerType")?d.click(a):d.hover(a,b)},_onFocusTrigger:function(a,b){var c=this;"click"===a?this.switchTo(b):this._switchTimer=setTimeout(function(){c.switchTo(b)},this.get("delay"))},_initPlugins:function(){this._plugins=[],this._plug(h),this._plug(i),this._plug(j)},switchTo:function(a){this.set("activeIndex",a)},_onRenderActiveIndex:function(a,b){this._switchTo(a,b)},_switchTo:function(a,b){this.trigger("switch",a,b),this._switchTrigger(a,b),this._switchPanel(this._getPanelInfo(a,b)),this.trigger("switched",a,b),this._isBackward=void 0},_switchTrigger:function(a,b){var c=this.get("triggers");c.length<1||(c.eq(b).removeClass(this.get("activeTriggerClass")),c.eq(a).addClass(this.get("activeTriggerClass")))},_switchPanel:function(a){a.fromPanels.hide(),a.toPanels.show()},_getPanelInfo:function(a,b){var c,d,e=this.get("panels").get(),g=this.get("step");return b>-1&&(c=e.slice(b*g,(b+1)*g)),d=e.slice(a*g,(a+1)*g),{toIndex:a,fromIndex:b,toPanels:f(d),fromPanels:f(c)}},prev:function(){this._isBackward=!0;var a=this.get("activeIndex"),b=(a-1+this.get("length"))%this.get("length");this.switchTo(b)},next:function(){this._isBackward=!1;var a=this.get("activeIndex"),b=(a+1)%this.get("length");this.switchTo(b)},_plug:function(a){var b=a.attrs;if(b)for(var c in b)!b.hasOwnProperty(c)||c in this.attrs||this.set(c,b[c]);a.isNeeded.call(this)&&(a.install&&a.install.call(this),this._plugins.push(a))},destroy:function(){var a=this;f.each(this._plugins,function(b,c){c.destroy&&c.destroy.call(a)}),k.superclass.destroy.call(this)}});c.exports=k});