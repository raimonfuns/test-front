/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/nicecode/index",["../../lib/jquery.min","../../aralejs/slide","../../aralejs/switchable","../../araleWidget/widget","../../araleBase/base","../../araleBase/class","../../araleBase/events","../../araleBase/aspect","../../araleBase/attribute","../../araleWidget/daparser","../../araleWidget/auto-render","../../aralejs/plugins/effects","../../aralejs/plugins/easing","../../aralejs/plugins/autoplay","../../aralejs/plugins/circular","../../lib/template.min","../../mod/dialog/dialog","../../mod/dialog/popup","../../mod/dialog/dialog-config","../../mod/screenWatch","./nicecodenav","../../mod/header","../../mod/login","../../mod/date","../../mod/myinfo","../../mod/jquery.cookie","../../tpl/output/loginHder","../../tpl/output/template","../../mod/nicecodeLoginSider","../../tpl/output/nicecodeLoginSider","../../mod/ajaxhelper"],function(a,b,c){function d(){slide=new k({element:"#slideS1",duration:300,effect:"scrollx",easing:"easeOutStrong",autoplay:!0,hasTriggers:!0,activeTriggerClass:"active"}).render()}function e(){h(v[0])}function f(){h(v[1])}function g(){h(v[2])}function h(a){j.ajax({url:a.serurl,dataType:"json",context:{maskId:j(a.targetObj).find(".btn-change")},success:function(b){b.result&&j(a.targetObj).html(l(a.tpl,b.data))}})}function i(){j.ajax({url:"/service/web/nicecode/mine/info",type:"GET",cache:!1,dataType:"json",success:function(a){a.data&&(j("#myCouponSize").html(a.data.couponSize||0),j("#myOrderSize").html(a.data.orderSize||0))}})}var j=jQuery=a("../../lib/jquery.min"),k=a("../../aralejs/slide"),l=a("../../lib/template.min"),m=a("../../mod/dialog/dialog");a("../../mod/screenWatch"),a("./nicecodenav"),a("../../mod/header"),a("../../mod/nicecodeLoginSider"),a("../../mod/ajaxhelper");var n=a("../../mod/login");n.getUserInfo(function(b){j("#loginArea").html(a("../../tpl/output/loginHder")(b)),b&&b.data.info.vipUser&&i()});for(var o=40003,p=40002,q=40001,r='{{each list as v i}}{{if i < 3}}<li><i>{{i+1}}</i><a href="{{v.url}}" target="_blank">{{v.desc}}</a></li>{{/if}}{{/each}}',s='<a href="{{list[0].url}}" target="_blank"><img src="{{list[0].images}}" alt="{{list[0].desc}}"/></a>',t='{{each list as v i}}{{if i < 3}}<li><i class="top-num__{{i+1}}">{{i+1}}</i><em></em><a href="http://vip.yy.com/vip/vmall2/detailpay?productId={{v.id}}" target="_blank">{{v.key}}</a></li>{{/if}}{{/each}}',u='{{each list as v i}}{{if i < 3}}<li><i class="top-num__{{i+1}}">{{i+1}}</i><em></em><a href="http://vip.yy.com/vip/vmall2/detailpay?productId={{v.id}}" target="_blank">{{#v.m_key}}<br/>{{#v.s_key}}</a></li>{{/if}}{{/each}}',v=[{serurl:"/service/web/nicecode/index/randomImList",tpl:"tpl_ImList",targetObj:"#imListBox",changeFunc:e},{serurl:"/service/web/nicecode/index/randomSessionNumberList",tpl:"tpl_ChList",targetObj:"#chListBox",changeFunc:f},{serurl:"/service/web/nicecode/index/randomLoversImList",tpl:"tpl_LoversList",targetObj:"#loversListBox",changeFunc:g}],w=0;w<v.length;w++){var x=v[w];h(x),j(x.targetObj).on("click",".btn-change",x.changeFunc)}j.ajax({url:"/service/web/nicecode/index/ranking",dataType:"json",success:function(a){a.result&&(j("#topImList").html(l.compile(t)({list:a.data.recommendImList})),j("#topChList").html(l.compile(t)({list:a.data.recommendChannelList})),j("#toploversListBox").html(l.compile(u)({list:a.data.recommendLoverList})))}}),function(){j.ajax({url:"http://vip.yy.com/vip/ads?adNo="+o+"&adNo="+p+"&adNo="+q,type:"GET",cache:!1,dataType:"jsonp",success:function(a){a.data&&(a.data[o]&&j("#mallTrendTop").html(l.compile(r)({list:a.data[o]})),a.data[p]&&j("#mallTrendAxd").html(l.compile(s)({list:a.data[p]})),a.data[q]&&a.data[q].length>0&&(j("#slideS1").html(l("tpl-mainslide",{list:a.data[q]})),d()))}})}(),j("#iptEvaluate").keypress(function(a){13==a.keyCode&&j("#btnEvaluate").click()}),j("#btnEvaluate").click(function(){var a=j.trim(j("#iptEvaluate").val());return""==a?(m.showMsgBox("评估号码不能为空"),!1):void j.ajax({url:"/service/web/nicecode/evaluate",dataType:"json",type:"GET",cache:!1,data:{imid:a},success:function(a){if(a.result){var b='<div class="certificate"><span class="yy_imid">{{imid}}</span><span class="grade">{{grade}}</span><span class="price">{{price}}</span><span class="beat">{{beat}}</span></div>',c=l.compile(b)(a.data);m({title:"温馨提示",content:c,skin:"ui-dialog-skin-vip",lock:!0,padding:"0"}).showModal()}else m.showMsgBox(a.desc)}})})});