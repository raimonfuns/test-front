/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/pagehelper",["../lib/jquery.min","../tpl/output/pager","../tpl/output/template"],function(a,b,c){var d=a("../lib/jquery.min");b.initPage=function(b,c,e,f){d(b).off().html(a("../tpl/output/pager")(c)).on("click","a",function(){d(this).hasClass("current")||(f=f||{},f.currentPage=d(this).data("pageno"),e(f))})}});