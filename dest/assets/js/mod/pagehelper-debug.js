/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/pagehelper-debug",["../lib/jquery.min-debug","../tpl/output/pager-debug","../tpl/output/template-debug"],function(a,b,c){var d=a("../lib/jquery.min-debug");b.initPage=function(b,c,e,f){d(b).off().html(a("../tpl/output/pager-debug")(c)).on("click","a",function(){d(this).hasClass("current")||(f=f||{},f.currentPage=d(this).data("pageno"),e(f))})}});