/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/araleBase/aspect",[],function(a,b,c){function d(a,b,c,d){for(var h,i,j=b.split(g);h=j.shift();)i=e(this,h),i.__isAspected||f.call(this,h),this.on(a+":"+h,c,d);return this}function e(a,b){var c=a[b];if(!c)throw new Error("Invalid method name: "+b);return c}function f(a){var b=this[a];this[a]=function(){var c=Array.prototype.slice.call(arguments),d=["before:"+a].concat(c);if(this.trigger.apply(this,d)!==!1){var e=b.apply(this,arguments),f=["after:"+a,e].concat(c);return this.trigger.apply(this,f),e}},this[a].__isAspected=!0}b.before=function(a,b,c){return d.call(this,"before",a,b,c)},b.after=function(a,b,c){return d.call(this,"after",a,b,c)};var g=/\s+/});