/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/date-debug",[],function(a,b,c){var d=new Array("January","February","March","April","May","June","July","August","September","October","November","December"),e=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");Date.prototype.format=function(a){if(!this.valueOf())return" ";var b=this;return a.replace(/(yyyy|yy|mmmm|mmm|mm|dddd|ddd|dd|hh|HH|nn|ss|a\/p)/gi,function(a){switch(a){case"yy":return b.getFullYear().substr(2);case"yyyy":return b.getFullYear();case"mmmm":return d[b.getMonth()];case"mmm":return d[b.getMonth()].substr(0,3);case"mm":return(b.getMonth()+1).zf(2);case"dddd":return e[b.getDay()];case"ddd":return e[b.getDay()].substr(0,3);case"dd":return b.getDate().zf(2);case"hh":return((h=b.getHours()%12)?h:12).zf(2);case"HH":return b.getHours();case"nn":return b.getMinutes().zf(2);case"ss":return b.getSeconds().zf(2);case"a/p":return b.getHours()<12?"am":"pm"}})},String.prototype.parse=function(a){var b=this.split(a);return 3==b.length?new Date(parseInt(b[0],10),parseInt(b[1]?b[1]-1:0,10),parseInt(b[2],10),0,0,0,0):void 0},Number.prototype.zf=function(a){return"0".string(a-this.toString().length)+this},Number.prototype.substr=function(a){return this.toString().substr(a)},String.prototype.string=function(a){for(var b="",c=0;c++<a;)b+=this;return b}});