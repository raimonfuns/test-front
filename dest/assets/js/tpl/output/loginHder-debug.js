/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/tpl/output/loginHder-debug",["./template-debug"],function(a){return a("./template-debug")("loginHder",function(a,b){var c=this,d=a.result,e=c.$escape,f=a.data,g="";return d?(g+=' <div class="vip-header__login__txt"> 欢迎您，<span class="vip-header__login__user">',g+=e(f.nick),g+='</span> </div> <div id="vipHeaderMyinfoNotice" class="vip-header__login__letter selected"><a href="/p/profile/myinfo.html"><i></i><img src="/assets/img/letter.png"></a></div> <div class="vip-header__login__link"> <a href="/p/profile/index.html" style="display: none;" id="vipHeaderCenterLink" target="_blank">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> '):g+=' <span>欢迎来到YY会员</span><a href="javascript:;" onclick="showUdbLogin();">[登录]</a><a href="http://udb.yy.com/register.do" target="_blank">[注册]</a> ',g+=" ",new String(g)})});