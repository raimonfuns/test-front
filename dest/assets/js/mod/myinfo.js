/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/myinfo",["../lib/jquery.min","../mod/jquery.cookie"],function(a,b,c){var d,e=jQuery=a("../lib/jquery.min"),f=(a("../mod/jquery.cookie"),"VIEW_INFO_MAX_ID"),g=e.cookie(f),h=!1,i=!1,j=3e4,k=function(a){e.ajax({url:"/service/web/user/getMaxWebmailId",type:"GET",cache:!1,dataType:"json",success:function(b){return d=b.data,i?(d>0&&e.cookie(f,d,{path:"/"}),void(i=!1)):(d>0&&(h=!0,g&&(h=g>=d?!1:!0)),void("function"==typeof a&&a(h)))}})},l=function(a){i=!0,e("#vipHeaderCenterLink").hide(),e("#vipHeaderMyinfoNotice").show(),e("#vipHeaderMyinfoNotice").removeClass("selected")},m=function(){k(function(a){1==a?(e("#vipHeaderCenterLink").hide(),e("#vipHeaderMyinfoNotice").show(),e("#vipHeaderMyinfoNotice").addClass("selected")):(e("#vipHeaderCenterLink").hide(),e("#vipHeaderMyinfoNotice").show(),e("#vipHeaderMyinfoNotice").removeClass("selected"))})},n=function(){m(),setInterval(m,j)};b.startCheck=n,b.checkNewMyInfo=m,b.readAll=l});