/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/edt",["../lib/jquery.min","./login","./date"],function(a,b,c){function d(){if(f&&g){var a=new Edt;a.regist(h),a.init(i,j.data.uid)}}var e=(jQuery=a("../lib/jquery.min"),a("./login")),f=!1,g=!1;a.async("../../js/edt.min.js",function(){f=!0,d()});var h,i,j;b.regist=function(a){a.nullRemove=!0,h=a,d()},b.init=function(a){e.getUserInfo(function(b){b.result||(b.data={uid:0}),j=b,i=a,g=!0,d()})}});