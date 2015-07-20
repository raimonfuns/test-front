/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/profile/privilege",["../../mod/header","../../mod/login","../../mod/date","../../lib/jquery.min","../../mod/myinfo","../../mod/jquery.cookie","../../tpl/output/loginHder","../../tpl/output/template","../../lib/template.min","../../mod/niftyplayer","../../mod/dialog/dialog","../../mod/dialog/popup","../../mod/dialog/dialog-config","../../mod/flashavatar","../../mod/swfobject","../../mod/screenWatch","../../mod/ajaxhelper"],function(a,b,c){function d(a){C.showMsgBox(a)}function e(){return null!=x&&x.result?!0:(showUdbLogin(),!1)}function f(){z.ajax({url:D+"getRedNameList",cache:!1,dataType:"json",success:function(a){if(a.result){var b=a.data,c=b.vipLevel,d=b.ids,e=0;e=null==d?0:d.length;var f=b.redNameCount;if(0>f&&(f=0),1==b.feeType||c>=6)1==b.feeType?z(".red-name__p").html("您是尊贵的<span>年费会员</span>，无需设置即享有全频道红名特权！").show():z(".red-name__p").html("您是<span>VIP"+c+"</span>，无需设置即享有全频道红名特权！").show();else if(0==b.vipUser||1==b.expired)0==b.vipUser?z(".red-name__p").html("您目前还不是YY会员，无法享受频道红名特权！").show():z(".red-name__p").html("您的YY会员资格已过期，无法享受频道红名特权！").show();else{var g="亲爱的VIP"+c+"用户，您可以设置 "+f+" 个红名频道，还有 "+b.resetCount+" 次修改机会";z(".red-name__p").html(g).show()}}for(var h=1;4>h;h++)z("#redName"+h).val("").next("input").val("");for(var h=0;e>h;h++)z("#redName"+(h+1)).val(d[h]).next("input").val(d[h]);for(var h=0;f>h;h++)z("#redName"+(h+1)).attr("disabled",!1)}})}function g(a,b){e()&&z.ajax({url:D+"saveRedName",cache:!1,dataType:"json",data:{setIids:a.join(","),resetIds:b.join(":")},context:{maskId:"red-name-submit"},success:function(a){if(a.result){d(A.compile(F)({desc:"保存红名设置成功！"}));var b="亲爱的VIP"+a.data.level+"用户，您可以设置 "+a.data.redNameCount+" 个红名频道，还有 "+a.data.resetCount+" 次修改机会";z(".red-name__p").html(b).show()}else{var c=parseInt(a.data.reason);d(2==c||9==c?"设置失败，请确认频道ID是否存在！":11==c?"设置失败，修改的红名频道个数超过次数限制！":"设置失败，系统繁忙，请稍后再试！")}}})}function h(){z.ajax({url:D+"defaultInfo",cache:!1,dataType:"json",success:function(a){var b=A("skin-list",a.data);z(".skin-select__list").html(b),z(".skin-select__list").on("click","a",function(){z(".skin-select__list a").removeClass("select-skin"),z(this).addClass("select-skin"),z(".skin-preview__img").css("background","url("+z(this).data("skin")+") no-repeat")}),z(".skin-preview__img").css("background","url("+a.data.userSkin+") no-repeat");var c=A("logo-list",a.data);z(".face-select__list").html(c),z(".face-select__list").on("click","a",function(){z(".face-select__list a").removeClass("select-logo"),z(this).addClass("select-logo"),z(".face-preview img").attr("src",z(this).data("logo"))}),z(".face-preview img").attr("src",a.data.logoUrl),E.embedCircleAvatar("skin_preview_pinfo_show_image",a.data.logoUrl?a.data.logoUrl:"http://dl.vip.yy.com/yyvippicture/webvipcom/1.png");var f;null!=x.data.info&&x.data.info.vipUser?(f=x.data.info.vipLevel+"",1!=x.data.info.feeType&&(2>=f?k([z("#ring-box-vip35"),z("#ring-box-vip6year"),z("#voice-box-vip35"),z("#voice-box-vip6year"),z("#remind-box-vip35"),z("#remind-box-vip6year")]):5>=f&&k([z("#ring-box-vip6year"),z("#voice-box-vip6year"),z("#remind-box-vip6year")]))):(f="0",k([z("#ring-box-vip12"),z("#ring-box-vip35"),z("#ring-box-vip6year"),z("#voice-box-vip12"),z("#voice-box-vip35"),z("#voice-box-vip6year"),z("#remind-box-vip12"),z("#remind-box-vip35"),z("#remind-box-vip6year")])),j(a.data.remindList,"remind"),z("#remind-box").on("click",":radio",function(){z("#remind-box__select").data("remindid",z(this).data("id"))}),j(a.data.voiceList,"voice"),z("#voice-box").on("click",":radio",function(){z("#voice-box-select").data("voiceid",z(this).data("id")).html("当前选择:<em>"+z(this).data("name")+"</em>")}),z("#voice-box-submit").click(function(){if(e()){var a=z("#voice-box-select").data("voiceid");0==a?d("请选择消息提醒铃声"):z.ajax({url:"/service/web/ring/ring/commit",dataType:"json",data:{type:2,ringId:a,inputCode:""},success:function(a){a.result?d(A.compile(F)({desc:"一对一语音设置成功！"})):(a.data.remains<=0&&(a.desc="你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦"),d(A.compile(G)(a)))}})}}),z("#voice-box-reset").click(function(){e()&&z.ajax({url:"/service/web/ring/ring/default",dataType:"json",data:{type:2},success:function(a){a.result?(d(A.compile(F)({desc:"一对一语音设置恢复默认成功"})),z("#voice-box :radio").attr("checked",!1),z("#voice-box-select").html("当前选择:<em>无</em>").data("voiceid",0)):(a.data.remains<=0&&1!=a.data.fee&&(a.desc="你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦"),d(A.compile(G)(a)))}})}),j(a.data.ringList,"ring"),z("#ring-box").on("click",":radio",function(){z("#ring-box-select").data("ringid",z(this).data("id")).html("当前选择:<em>"+z(this).data("name")+"</em>")}),z("#ring-box-submit").click(function(){if(e()){var a=z("#ring-box-select").data("ringid");0==a?d("请选择消息提醒铃声"):z.ajax({url:"/service/web/ring/ring/commit",dataType:"json",data:{type:1,ringId:a,inputCode:""},context:{maskId:this},success:function(a){a.result?a.data.remains<=0&&1!=a.data.fee?(a.desc="你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦",d(A.compile(G)(a))):d(A.compile(F)({desc:"消息铃声设置成功"})):d(A.compile(G)(a))}})}}),z("#ring-box-reset").click(function(){e()&&z.ajax({url:"/service/web/ring/ring/default",cache:!1,dataType:"json",data:{type:1},success:function(a){a.result?(d(A.compile(F)({desc:"消息铃声设置恢复默认成功"})),z("#ring-box :radio").attr("checked",!1),z("#ring-box-select").html("当前选择:<em>无</em>").data("ringid",0)):(a.data.remains<=0&&1!=a.data.fee&&(a.desc="你本月修改次数已达上限，VIP6与年费用户享有无限次修改权限哦"),d(A.compile(G)(a)))}})}),z(".ring-box__table").on("click","a",function(){B.loadAndPlay(z(this).data("url"))}),i()}})}function i(){z.ajax({url:"/service/web/ring/ring/info",cache:!1,dataType:"json",success:function(a){a.result&&(z("#ring-box :radio[data-id="+a.data.ringid1+"]").trigger("click"),z("#voice-box :radio[data-id="+a.data.ringid2+"]").trigger("click"))}})}function j(a,b){var c={};c.type=b,c.data=l(a,"2"),z("#"+b+"-box-vip12").html(A("ring-list",c)),c.data=l(a,"5"),z("#"+b+"-box-vip35").html(A("ring-list",c)),c.data=l(a,"6"),z("#"+b+"-box-vip6year").html(A("ring-list",c))}function k(a){for(var b=0;b<a.length;b++)a[b].parent("tr").addClass("disable")}function l(a,b){if(e()){for(var c=[],d=a.length-1;d>=0;d--)null!=x.data.info&&x.data.info.vipUser?1==x.data.info.feeType?a[d].disabled=!1:a[d].disabled=-1==z.inArray(x.data.info.vipLevel+"",a[d].levelRequest):a[d].disabled=!0,-1!=z.inArray(b,a[d].levelRequest)&&(c=c.concat(a.splice(d,1)));return c}}function m(){z.ajax({url:"/service/web/ring/getFriends",cache:!1,dataType:"json",success:function(a){if(a.result&&null!=a.data.friends){O=a.data.friends,z(".firend-box__bd table").html(A("friend-list",{list:O[0]}));var b='<select>{{each groups as v i}}<option value="{{i}}">{{v}}</option>{{/each}}</select>';z("#selFirends1,#selFirends2").html(A.compile(b)(a.data))}}}),n(),o(),p()}function n(){z.ajax({url:"/service/web/ring/getRingSettings",cache:!1,dataType:"json",success:function(a){if(a.result){a.data.remindRingSettings&&z("#remindRingSetNumber").html(a.data.remindRingSettings.length),a.data.remindRingMaxNumber&&z("#remindRingLeftNumber").html(a.data.remindRingMaxNumber-a.data.remindRingSettings.length);var b=A("ring-set-friend-list",a.data);z("#remind-setting-table tbody").html(b)}}})}function o(){z.ajax({url:D+"loadOnlineSettings",cache:!1,dataType:"json",success:function(a){a.result&&(z("#set-hideToOnline table").html(A("hideToOnline-set-list",a.data)),z("#set-onlineToHide table").html(A("onlineToHide-set-list",a.data)),z("#online-set-number").html(a.data.setNum),z("#online-set-left-number").html(a.data.canSet))}})}function p(){z("#remind-box-friends").delegate(".firend-box__set","click",function(){if(e()){var a=z("#remind-box__select").data("remindid");0==a?d("请选择上线提醒铃声"):z.ajax({url:"/service/web/ring/saveRemind",cache:!1,dataType:"json",data:{friendUid:z(this).data("uid"),ringId:a},context:{maskId:this},success:function(a){if(a.result){z("#remindRingSetNumber").html(a.data.settings.length),z("#remindRingLeftNumber").html(a.data.remindRingMaxNumber-a.data.settings.length),a.data.remindRingSettings=a.data.settings;var b=A("ring-set-friend-list",a.data);z("#remind-setting-table tbody").html(b)}else d(a.desc)}})}}),z(".remind-setting__bd").delegate(".remind-setting__cancel","click",function(){e()&&z.ajax({url:"/service/web/ring/removeRemind",cache:!1,dataType:"json",data:{removeIds:z(this).data("uid")},context:{maskId:this},success:function(a){if(a.result){z("#remindRingSetNumber").html(a.data.settings.length),z("#remindRingLeftNumber").html(a.data.remindRingMaxNumber-a.data.settings.length),a.data.remindRingSettings=a.data.settings;var b=A("ring-set-friend-list",a.data);z("#remind-setting-table tbody").html(b)}else d(a.desc)}})}),z("#clear-all-remind").click(function(){var a=[];z(".remind-setting__cancel").each(function(b,c){a.push(z(this).data("uid"))}),z.ajax({url:"/service/web/ring/removeRemind",cache:!1,dataType:"json",data:{removeIds:a.join(",")},success:function(a){z("#remindRingSetNumber").html(a.data.settings.length),z("#remindRingLeftNumber").html(a.data.remindRingMaxNumber-a.data.settings.length),a.data.remindRingSettings=a.data.settings;var b=A("ring-set-friend-list",a.data);z("#remind-setting-table tbody").html(b)}})}),z("#online-set-friends").delegate(".firend-box__set","click",function(){if(e()){var a=0;z.each(z(".online-privilege__hd li.current"),function(b,c){a=z(this).data("settype")}),z.ajax({url:"/service/web/setting/setOnlineHide",cache:!1,dataType:"json",data:{friendUid:z(this).data("uid"),setType:a},context:{maskId:this},success:function(a){a.result?(z("#set-hideToOnline table").html(A("hideToOnline-set-list",a.data)),z("#set-onlineToHide table").html(A("onlineToHide-set-list",a.data)),z("#online-set-number").html(a.data.setNum),z("#online-set-left-number").html(a.data.canSet)):d(a.desc)}})}}),z(".select-persion__bd").delegate(".setting__cancel","click",function(a){e()&&z.ajax({url:"/service/web/setting/setOnlineHide",cache:!1,dataType:"json",data:{friendUid:z(this).data("uid"),setType:z(this).data("settype")},context:{maskId:this},success:function(a){a.result?(z("#set-hideToOnline table").html(A("hideToOnline-set-list",a.data)),z("#set-onlineToHide table").html(A("onlineToHide-set-list",a.data)),z("#online-set-number").html(a.data.setNum),z("#online-set-left-number").html(a.data.canSet)):d(a)}})})}function q(a){z(".popup-select__list").html(A("popupTpl",a)),z(".popup-select__list a:first").trigger("click")}function r(){z.getScript("http://do.yy.duowan.com/yy7/bubbles.json"),z(".popup-select__list").delegate("a","click",function(){z(".popup-select__list a").removeClass("selected"),z(this).addClass("selected"),z(".popup-preview__img--s").removeClass().addClass("popup-preview__img--s popup-preview__img--s"+z(this).data("id"))}),z("#select-popup-submit").on("click",function(){e()&&z.ajax({url:'http://mysettings.yy.com/front/saveVipBubble?appId=5060&sign=&data={"bubbleid":'+z(".popup-select__list a.selected").data("id")+"}",dataType:"jsonp",context:{maskId:this},success:function(a){if(0==a.resultcode)d(A.compile(F)({desc:"消息气泡设置成功！"}));else{var b=!1;10==a.resultcode?(b=!0,a.desc="成为YY会员，立享多彩对话气泡特权！"):a.desc="设置消息气泡失败！",C({id:"dialogMsgBox",padding:"10px 15px",skin:"ui-dialog-skin-vip",content:A.compile(G)(a),okValue:b?"开通会员":"确定",ok:function(){b&&window.open("http://vip.yy.com/vip/vmall2?type=year","_blank")}}).showModal()}}})})}function s(a){z(".infoskin-select__list").html(A("infoskinTpl",a)),z(".infoskin-select__list a:first").trigger("click")}function t(){z.getScript("http://do.yy.duowan.com/yy7/skins.json"),z.ajax({url:"http://show.vip.yy.com/service/web/vinfo",dataType:"jsonp",success:function(a){a.result&&a.data.yshowImg?z(".infoskin-preview__yshow").attr("src",a.data.yshowImg):z(".infoskin-preview__yshow").attr("src","http://dl2.vip.yystatic.com/yyvippicture/eba5c4ccab8e3d5d3f1e316ec616a8cf.png")}}),z(".infoskin-select__list").delegate("a","click",function(){z(".infoskin-select__list a").removeClass("selected"),z(this).addClass("selected"),z(".infoskin-preview__img").css("background-image","url("+z(this).data("imgurl")+")")}),z("#select-infoskin-submit").on("click",function(){e()&&z.ajax({url:'http://mysettings.yy.com/front/saveVipSkin?appId=5060&sign=&data={"skinid":'+z(".infoskin-select__list a.selected").data("id")+"}",dataType:"jsonp",context:{maskId:this},success:function(a){if(0==a.resultcode)d(A.compile(F)({desc:"资料卡皮肤设置成功！"}));else{var b=!1;10==a.resultcode?(b=!0,a.desc="成为YY会员，立享资料卡皮肤特权！"):a.desc="设置资料卡皮肤失败！",C({id:"dialogMsgBox",padding:"10px 15px",skin:"ui-dialog-skin-vip",content:A.compile(G)(a),okValue:b?"开通会员":"确定",ok:function(){b&&window.open("http://vip.yy.com/vip/vmall2?type=year","_blank")}}).showModal()}}})})}function u(a){z(".logoprecious-select__list").html(A("logopreciousTpl",a)),z(".logoprecious-select__list a:first").trigger("click")}function v(){z.getScript("http://do.yy.duowan.com/yy7/frames.json"),y.getUserInfo(function(a){a.result?y.getUserLogo(function(a){z(".logoprecious-preview__img img").attr("src",a)}):z(".logoprecious-preview__img img").attr("src","http://dl.vip.yy.com/yyvippicture/webvipcom/1.jpg")}),z(".logoprecious-select__list").delegate("a","click",function(){z(".logoprecious-select__list a").removeClass("selected"),z(this).addClass("selected"),z("#logoprecious-preview__icon1").css("background-image","url("+z(this).data("panelurl")+")"),z("#logoprecious-preview__icon2").css("background-image","url("+z(this).data("imurl")+")")}),z("#select-logoprecious-submit").on("click",function(){e()&&z.ajax({url:'http://mysettings.yy.com/front/saveVipFrame?appId=5060&sign=&data={"frameId":'+z(".logoprecious-select__list a.selected").data("id")+"}",dataType:"jsonp",context:{maskId:this},success:function(a){if(0==a.resultcode)d(A.compile(F)({desc:"头像框饰设置成功！"}));else{var b=!1;10==a.resultcode?(b=!0,a.desc="成为YY会员，立享头像框饰特权！"):a.desc="设置头像框饰失败！",C({id:"dialogMsgBox",padding:"10px 15px",skin:"ui-dialog-skin-vip",content:A.compile(G)(a),okValue:b?"开通会员":"确定",ok:function(){b&&window.open("http://vip.yy.com/vip/vmall2?type=year","_blank")}}).showModal()}}})})}function w(){z(window).scrollTop()>L?K.find(".mod-preview").addClass("fixed").css("left",M):K.find(".mod-preview").removeClass("fixed")}a("../../mod/header");var x,y=a("../../mod/login"),z=jQuery=a("../../lib/jquery.min"),A=a("../../lib/template.min"),B=a("../../mod/niftyplayer"),C=a("../../mod/dialog/dialog"),D="/service/web/setting/",E=a("../../mod/flashavatar")();a("../../mod/screenWatch"),a("../../mod/ajaxhelper");var F='<div class="alert-box__bd"><div class="sys-tips sys-tips--succeed"><i></i><span class="sys-tips__txt"><strong>设置成功</strong></span></div><div class="alert-box__txt"><p>{{desc}}</p></div></div>',G='<div class="alert-box__bd"><div class="sys-tips sys-tips--error"><i></i><span class="sys-tips__txt"><strong>设置失败</strong></span></div><div class="alert-box__txt"><p>{{desc}}</p></div></div>',H=!1,I=!1,J=!1,K=null,L=0,M=0;z(".side-privilege_list").delegate("a","click",function(){z(this).parent().addClass("current").siblings().removeClass("current"),z(".tab-box__bd").hide(),z("#tab-box-"+z(this).data("target")).show(),K=z("#tab-box-"+z(this).data("target")),K.find(".mod-preview").length>0&&(L=K.find(".mod-preview").offset().top,M=K.find(".mod-preview").offset().left),z(this).data("intro")?z(".box__hd__title-link").attr("href","http://vip.yy.com/vip/introduction#"+z(this).data("intro")).show():z(".box__hd__title-link").hide(),"23"==z(this).data("intro")?H||(r(),H=!0):"24"==z(this).data("intro")?I||(t(),I=!0):"25"==z(this).data("intro")&&(J||(v(),J=!0))}).delegate("a","focus",function(a){this.blur&&this.blur()});var N=window.location.hash;N&&/^[0-8]$/.test(N.substring(1))?z(z(".side-privilege_list").find("a")[N.substring(1)]).trigger("click"):z(".side-privilege_list").find("a").first().trigger("click"),y.getUserInfo(function(a){if(x=a,h(),m(),a.result||showUdbLogin(),a.result&&null!=a.data&&a.data.info.vipUser){var b=a.data.info;z(".ringing__note").html('<i class="vip-level v'+b.vipLevel+'"></i>你好，你当前是<strong>VIP'+b.vipLevel+"</strong>，VIP6与年费会员可以设置所有音乐，享有无限次修改的权限哦~"),1==b.feeType?z(".red-name__p").html("您是尊贵的<span>年费会员</span>，无需设置即享有全频道红名特权！").show():b.vipLevel>=6?z(".red-name__p").html("您是尊贵的<span>V"+b.vipLevel+"会员</span>，无需设置即享有全频道红名特权！").show():(z("#firstChannel").removeAttr("disabled"),z("#secondChannel").removeAttr("disabled"),b.vipLevel>=3&&b.vipLevel<=5&&z("#thirdChannel").removeAttr("disabled"))}var c=a.data.logo,d=a.data.nick;a.result||(c="http://dl.vip.yy.com/yyvippicture/webvipcom/1.png",d=""),d=d.replace(/>/gi,"&gt;").replace(/</gi,"&lt;"),z("#skin_preview_pinfo-name_cnt").text(d)}),f(),z("#red-name-submit").click(function(){if(e()){if(1==x.data.info.feeType)return void d("您是尊贵的年费会员，无需设置即享有全频道红名特权！");for(var a=[],b=[],c=1;4>c;c++)if(null==z("#redName"+c).attr("disabled")){var f=z.trim(z("#redName"+c).val());if(""==f)continue;""==z("#redName"+c).next("input").val()?a.push(f):f!=z("#redName"+c).next("input").val()&&b.push(z("#redName"+c).next("input").val()+","+f)}g(a,b)}}),z(".online-privilege__hd li").click(function(){z(this).addClass("current").siblings().removeClass("current"),z("#set-"+z(this).data("type")).show(),z("#set-"+z(this).siblings().data("type")).hide()});var O=[];z("#selFirends1,#selFirends2").delegate("select","change",function(){z(this).parent(".firend-box__hd").siblings(".firend-box__bd").find("table").html(A("friend-list",{list:O[z(this).val()]}))}),z("#select-skin-submit").click(function(){if(e()){var a=z(".skin-select__list a.select-skin");0==a.length?d("请选择皮肤"):z.ajax({url:D+"setSkin",cache:!1,dataType:"json",context:{maskId:"select-skin-submit"},data:{showForOther:z("#skin-showtoother").prop("checked"),url:a.data("skin")},success:function(a){a.result?(a.desc="",d(A.compile(F)(a))):d(A.compile(G)(a))}})}}),z("#select-logo-submit").click(function(){if(e()){var a=z(".face-select__list a.select-logo");0==a.length?d("请选择头像"):z.ajax({url:D+"setLogo",cache:!1,dataType:"json",context:{maskId:this},data:{logoId:a.data("logoid")},success:function(b){b.result?(b.desc="",E.embedCircleAvatar("skin_preview_pinfo_show_image",a.attr("data-logo")),d(A.compile(F)(b))):d(A.compile(G)(b))}})}}),window.showBubbleList=q,window.showSkinList=s,window.showFramesList=u,a.async("../../mod/swfobject.js",function(a){var b={};b.quality="high",b.bgcolor="#ffffff",b.allowscriptaccess="all",b.allowfullscreen="true",a.embedSWF("/assets/flash/niftyplayer.swf?file=betty.mp3&as=0","niftyPlayer1","0","0","10.2.0","/assets/flash/playerProductInstall.swf",{},b,{})}),z(window).scroll(w).resize(function(){L=K.find(".mod-preview").offset().top,M=K.find(".mod-preview").offset().left,w()}),function(){z.ajax({url:"http://vip.yy.com/vip/ad?adNo=10101",type:"GET",cache:!1,dataType:"jsonp",success:function(a){var b='<a class="mod-axd" href="{{url}}" target="_blank"><img src="{{images}}" alt="{{desc}}"/></a><div class="mod-axd-bar"><span class="dot-left"></span></div>',c=A.compile(b);null!=a.data&&z(".user-profile-ad1").html(c(a.data))}})}(),function(){z.ajax({url:"/service/web/nicecodeicon/index",type:"GET",cache:!1,dataType:"json",success:function(a){var b=a.data.icons;if(b&&b.length)for(var c=null,d=0,e=b.length;e>d;d++)if(c=b[d],1===c.inUse){a.data.selectedName=c.name,a.data.selectedId=c.priviType+":"+c.type;break}1e3===a.code?"object"==typeof a.data?a.data.isLogin=!1:a.data={isLogin:!1}:"object"==typeof a.data?a.data.isLogin=!0:a.data={isLogin:!0},z("#tab-box-setcode").html(A("tpl-managecode",a.data))}})}(),z(document.body).delegate("#tab-box-setcode .j-item","click",function(){var a=z(this),b=a.attr("data-pid"),c=a.find(".j-iconname").text(),d=z("#tab-box-setcode .j-btn"),e=z("#tab-box-setcode .j-name");a.addClass("selected").siblings().removeClass("selected"),e.html(c),d.attr("data-pid",b)}),z(document.body).delegate("#tab-box-setcode .j-btn","click",function(){var a=z(this),b=a.attr("data-pid").split(":"),c=z("#tab-box-setcode .j-time");z.ajax({url:"/service/web/nicecodeicon/changeIcon",type:"GET",cache:!1,dataType:"json",data:{priviType:b[0],type:b[1]},context:{maskId:this},success:function(a){a.result?d(a.desc):-2==a.code?C({padding:"10px 15px",skin:"ui-dialog-skin-vip",content:"你目前没有图标更换机会，兑换靓号图标变更卡，即可更换图标。",okValue:"兑换变更卡",ok:function(){window.open("http://vip.yy.com/vip/vcard/index#exchange|193")}}).showModal():-1==a.code?C({padding:"10px 15px",skin:"ui-dialog-skin-vip",content:"开通会员即可设置靓号图标",okValue:"开通会员",ok:function(){window.open("http://vip.yy.com/vip/vmall2?type=year")}}).showModal():d(a.desc),c.html(a.data)}})})});