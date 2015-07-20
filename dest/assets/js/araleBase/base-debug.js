/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/araleBase/base-debug",["./class-debug","./events-debug","./aspect-debug","./attribute-debug"],function(a,b,c){function d(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d="_onChange"+e(c);a[d]&&a.on("change:"+c,a[d])}}function e(a){return a.charAt(0).toUpperCase()+a.substring(1)}var f=a("./class-debug"),g=a("./events-debug"),h=a("./aspect-debug"),i=a("./attribute-debug");c.exports=f.create({Implements:[g,h,i],initialize:function(a){this.initAttrs(a),d(this,this.attrs)},destroy:function(){this.off();for(var a in this)this.hasOwnProperty(a)&&delete this[a];this.destroy=function(){}}})});