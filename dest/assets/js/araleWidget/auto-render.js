/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/araleWidget/auto-render",["../lib/jquery.min"],function(a,b,c){var d=jQuery=a("../lib/jquery.min"),e="data-widget-auto-rendered";b.autoRender=function(a){return new this(a).render()},b.autoRenderAll=function(a,c){"function"==typeof a&&(c=a,a=null),a=d(a||document.body);var f=[],g=[];a.find("[data-widget]").each(function(a,c){b.isDataApiOff(c)||(f.push(c.getAttribute("data-widget").toLowerCase()),g.push(c))}),f.length&&seajs.use(f,function(){for(var a=0;a<arguments.length;a++){var b=arguments[a],f=d(g[a]);if(!f.attr(e)){var h={initElement:f,renderType:"auto"},i=f.attr("data-widget-role");h[i?i:"element"]=f,b.autoRender&&b.autoRender(h),f.attr(e,"true")}}c&&c()})};var f="off"===d(document.body).attr("data-api");b.isDataApiOff=function(a){var b=d(a).attr("data-api");return"off"===b||"on"!==b&&f}});