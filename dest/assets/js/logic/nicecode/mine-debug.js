/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/nicecode/mine-debug",["../../lib/jquery.min-debug","../../mod/login-debug","../../mod/date-debug","../../lib/template.min-debug","../../mod/dialog/dialog-debug","../../mod/dialog/popup-debug","../../mod/dialog/dialog-config-debug","../../mod/header-debug","../../mod/myinfo-debug","../../mod/jquery.cookie-debug","../../tpl/output/loginHder-debug","../../tpl/output/template-debug","../../mod/ajaxhelper-debug","./nicecodenav-debug","../../mod/pagehelper-debug","../../tpl/output/pager-debug"],function(a,b,c){function d(a){g("#imListBox .loading").show(),g.ajax({url:"/service/web/nicecode/mine/info",dataType:"json",data:{listData:1},success:function(b){if(g("#imListBox .loading").hide(),b.result){var c=b.data[a.datafiled];g("#"+a.contaner).html(h(a.tpl,{datas:c}))}}})}function e(){var a=g(h("tpl_bindchannel",{})),b={imid:""};k&&k.data&&(b=k.data);var c,d,e,f,i,l=g(h("tpl_bindyy",b)),m=!1,n=!1,o=g(this).attr("data-set-id"),p=parseInt(g(this).attr("data-set-type"),10),q="频道靓号",r="频道号";switch(p){case 1:case 12:q="频道靓号",r="频道号",i=a;break;case 2:case 13:case 21:q="YY靓号",r="YY号",i=l;break;default:q="频道靓号",r="频道号",i=a}if(c=i.find(".j-shortid"),d=i.find(".j-channelinput"),e=i.find(".j-channeltips"),f=i.find(".j-channeltypesuc"),m=!1,n=!1,d.data("code",o),e.hide(),f.hide(),d.val(""),m=!1,n=!1,1==p||12==p){var s=i;s.show(),g.ajax({url:"/service/web/nicecode/mine/code/gobind",dataType:"json",type:"GET",data:{orderId:o},cache:!1,success:function(a){a.result?(c.html("<em style='margin-right:3px;'>&nbsp;</em>"+q+"："+a.data.asid),j({id:"channelbindtips",title:"提示",skin:"ui-dialog-skin-vip",content:s,okValue:"确定",padding:"10px 15px",lock:!0,ok:function(){var a=g.trim(d.val());return a&&0!=a.length?/^\d+$/.test(a)?n&&m?void g.ajax({url:"/service/web/nicecode/mine/code/bind",dataType:"json",type:"GET",cache:!1,data:{channel:a},success:function(a){1e3==a.code?window.showUdbLogin():j.showMsgBox(a.desc)}}):(g.ajax({url:"/service/web/nicecode/mine/code/check",dataType:"json",type:"GET",cache:!1,context:d.node,data:{channel:a},success:function(a){if(a.result)switch(a.code){case 1e3:window.showUdbLogin();break;case 1:m=!1,n=!1,e.html(a.desc).show(),f.hide();break;case 2:m=!1,n=!1,e.html(a.desc+'<a class="j-checkchannel" href="http://hao.yy.com/owauth/authDefault" target="_blank" style="text-decoration:underline;">现在认证</a>').show(),f.hide();break;case 3:m=!0,n=!0,e.hide(),f.show()}}}),!1):(n=!1,e.html("所绑定的"+r+"必须为数字，您输入了非法字符！").show(),f.hide(),!1):(n=!1,e.html("所绑定的"+r+"不能为空").show(),f.hide(),!1)},cancel:function(){},cancelValue:"取消"}).showModal()):j.showMsgBox(a.desc)}})}else 2==p||13==p||21==p?g.ajax({url:"/service/web/nicecode/mine/code/checkImidOrder",dataType:"json",type:"GET",data:{orderId:o},cache:!1,success:function(a){a.result?(c.html("<em style='margin-right:3px;'>&nbsp;</em>"+q+"："+a.data.newImid),j({id:"channelbindtips",title:"提示",content:i.get(0),okValue:"确定",padding:"10px 15px",lock:!0,ok:function(){g.ajax({url:"/service/web/nicecode/bindImid",dataType:"json",type:"GET",data:{orderId:o},cache:!1,success:function(a){200==a.code?j.showMsgBox(a.desc,"温馨提示",function(){window.location.href="https://udb.yy.com/"}):j.showMsgBox(a.desc)}})},cancel:function(){},cancelValue:"取消"}).showModal()):j.showMsgBox(a.desc)}}):8==p&&(window.location.href="/vip/nicecode/loveractive?orderId="+o)}function f(){var a=g(this).attr("data-id"),b=g(this).attr("data-payType");g.ajax({url:"/service/web/nicecode/checkRepay",dataType:"json",type:"GET",cache:!1,async:!1,data:{orderId:a},success:function(c){c.result?g.ajax({url:"http://vip.yy.com/vip/vmall2/productRepay",dataType:"json",type:"GET",cache:!1,async:!1,data:{orderId:a,payType:b},success:function(a){a.result?window.open(a.data.url,"_blank"):j.showMsgBox(a.desc)}}):j.showMsgBox(c.desc)}})}var g=jQuery=a("../../lib/jquery.min-debug"),h=(a("../../mod/login-debug"),a("../../lib/template.min-debug")),j=a("../../mod/dialog/dialog-debug");a("../../mod/header-debug"),a("../../mod/ajaxhelper-debug"),a("./nicecodenav-debug");var k,l=a("../../mod/login-debug");l.getUserInfo(function(a){k=a,a&&a.data&&a.data.info&&a.data.info.vipUser}),h.helper("$dateFormat",function(a){time=new Date(a);var b=time.getFullYear(),c=time.getMonth()+1,d=time.getDate(),e=time.getHours(),f=time.getMinutes(),g=time.getSeconds();return b+"-"+(c>=10?c:"0"+c)+"-"+(d>=10?d:"0"+d)+" "+(e>=10?e:"0"+e)+":"+(f>=10?f:"0"+f)+":"+(g>=10?g:"0"+g)});var m={1:"频道靓号",2:"YY靓号",3:"Y秀",4:"V卡",6:"频道加油卡",7:"活动会员时长",8:"情侣靓号",13:"定制yy号"};h.helper("$getGoodsName",function(a){for(var b=a.split(","),c="",d=0;d<b.length;d++)c+="和"+(m[b[d]]?m[b[d]]:"");return c.substring(1)}),h.helper("$moneyFormat",function(a,b){b=b>0&&20>=b?b:2,a=parseFloat((a+"").replace(/[^\d\.-]/g,"")).toFixed(b)+"";var c=a.split(".")[0].split("").reverse(),d=a.split(".")[1];for(t="",i=0;i<c.length;i++)t+=c[i]+((i+1)%3==0&&i+1!=c.length?",":"");return t.split("").reverse().join("")+"."+d});var n,o=1,p=window.location.search.substr(1).match(/(^|[&|?])type=([^&]*)(&|$)/);null!=p&&(o=unescape(p[2]));var q=[{tpl:"tpl_orderbuy_List",contaner:"orderbuy_List",datafiled:"orderbuy"},{tpl:"tpl_history_List",contaner:"history_List",datafiled:"history"},{tpl:"tpl_couponList_List",contaner:"couponList_List",datafiled:"couponList"}];a("../../mod/pagehelper-debug");g("#customNav").on("click","a",function(){if(!g(this).hasClass("active")){var a=g(this).data("type");g("#table-"+a).show().siblings(".custom-search-rule").hide(),g(this).addClass("active").parent("li").siblings().find("a").removeClass("active"),n=q[a-1],d(n)}}).find("a[data-type="+o+"]").trigger("click"),g("#orderlist").delegate(".j-bind","click",e),g("#orderlist").delegate(".repay-order","click",f)});