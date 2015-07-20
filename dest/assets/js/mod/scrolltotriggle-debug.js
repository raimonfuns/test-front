/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/scrolltotriggle-debug",["../lib/jquery.min-debug"],function(a,b,c){var d=a("../lib/jquery.min-debug"),e=0,f=0,g="",h=d(window),i=d(window.document),j=[],k=function(){var a=h.height(),b=i.height(),c=h.scrollTop();g=c>e?"down":c>e?"up":"",e=c,f=b-a-e};k(),h.scroll(function(){k();for(var a=0,b=j.length;b>a;a++)j[a].call({toTop:e,toBottom:f,directive:g})});var l={addAction:function(a){if("function"!=typeof a)return!1;var b=0;for(j.length;b<length;b++)if(j[b]===a)return!1;j.push(a)},removeAction:function(a){var b;if("function"!=typeof a)return!1;var c=0;for(j.length;c<length;c++)j[c]!==a&&(b.push=j[c]);j=b}};c.exports=l});