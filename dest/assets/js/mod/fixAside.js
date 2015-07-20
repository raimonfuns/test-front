/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/fixAside",[],function(a,b,c){var d=function(a,b){this.$node=$(a),this.pos=this.$node.offset(),this.offset=parseInt(b),this.$win=$(window).on("scroll",$.proxy(this.checkPos,this))};d.prototype={constructor:d,checkPos:function(){var a=this.$win.scrollTop();this.pos&&(a+this.offset>this.pos.top?this.$node.addClass("fixed"):this.$node.removeClass("fixed"))}},c.exports=d});