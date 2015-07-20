/*<TMODJS> <MD5:c863737e9812298942e78d033a4c8840>*/
define(function(require){return require('./template')('loginHder', function($data,$id
/**/) {
var $helpers=this,result=$data.result,$escape=$helpers.$escape,data=$data.data,$out='';if(result){
$out+=' <div class="vip-header__login__txt"> 欢迎您，<span class="vip-header__login__user">';
$out+=$escape(data.nick);
$out+='</span> </div> <div id="vipHeaderMyinfoNotice" class="vip-header__login__letter selected"><a href="/p/profile/myinfo.html"><i></i><img src="/assets/img/letter.png"></a></div> <div class="vip-header__login__link"> <a href="/p/profile/index.html" style="display: none;" id="vipHeaderCenterLink" target="_blank">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> ';
}else{
$out+=' <span>欢迎来到YY会员</span><a href="javascript:;" onclick="showUdbLogin();">[登录]</a><a href="http://udb.yy.com/register.do" target="_blank">[注册]</a> ';
}
$out+=' ';
return new String($out);
});});