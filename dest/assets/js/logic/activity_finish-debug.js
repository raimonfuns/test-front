/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/activity_finish-debug",["../lib/jquery.min-debug","../aralejs/slide-debug","../aralejs/switchable-debug","../araleWidget/widget-debug","../araleBase/base-debug","../araleBase/class-debug","../araleBase/events-debug","../araleBase/aspect-debug","../araleBase/attribute-debug","../araleWidget/daparser-debug","../araleWidget/auto-render-debug","../aralejs/plugins/effects-debug","../aralejs/plugins/easing-debug","../aralejs/plugins/autoplay-debug","../aralejs/plugins/circular-debug","../mod/date-debug","../lib/template.min-debug","../mod/scrolltotriggle-debug","../mod/header-debug","../mod/login-debug","../mod/myinfo-debug","../mod/jquery.cookie-debug","../tpl/output/loginHder-debug","../tpl/output/template-debug","../mod/loginSider-debug","../tpl/output/loginSider-debug"],function(a,b,c){function d(){var a=g(window).width();9>h&&(1200>a?g("body").removeClass("screen-wide"):g("body").addClass("screen-wide")),e()}function e(){var a,b=g(window).width();a=1200>b?"narrow":"wide"}function f(){var a=-1;if("Microsoft Internet Explorer"==navigator.appName){var b=navigator.userAgent,c=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");null!=c.exec(b)&&(a=parseFloat(RegExp.$1))}else if("Netscape"==navigator.appName){var b=navigator.userAgent,c=new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");null!=c.exec(b)&&(a=parseFloat(RegExp.$1))}return a}var g=jQuery=a("../lib/jquery.min-debug");a("../aralejs/slide-debug");a("../mod/date-debug");var h=f(),i=(g(window).width()<1200?"narrow":"wide",null);g(window).resize(function(){clearTimeout(i),i=setTimeout(function(){d()},300)}),d();var j=a("../lib/template.min-debug"),k=a("../mod/scrolltotriggle-debug");j.helper("$dataFormat",function(a){return new Date(a).format("yyyy-mm-dd")});var l={_isEmpty_:!1,_length_:8,_current_:0,_$container_:g("#rpl-finishactivity"),_$loading_:g("#rpl-activityloading"),_isAjax_:!1,_type_:2,get:function(){var a=this;return a._isAjax_?!1:(a._isAjax_=!0,a._isEmpty_?!1:(a._$loading_.show(),a._current_=a._current_+1,void g.ajax({url:"/service/web/activitycenter/page",type:"GET",dataType:"json",cache:!1,data:{pageno:a._current_,pagesize:a._length_,type:a._type_},success:function(b){var c=b.data;a._isAjax_=!1,null!==c&&(0==c.list.length&&(a._isEmpty_=!0),a._$container_.append(j("tpl-activity",c)))},complete:function(){a._$loading_.hide()}})))}};k.addAction(function(){this.toBottom<200&&this.toBottom>100&&"down"==this.directive&&l.get()}),g(document).ready(function(){l.get(),a("../mod/header-debug"),a("../mod/loginSider-debug")})});