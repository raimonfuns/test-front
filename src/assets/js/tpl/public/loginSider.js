/*<TMODJS> <MD5:904ad93ab97004d3f57410cb008d7087>*/
define(function(require){return require('./template')('loginSider', function($data,$id
/**/) {
var $helpers=this,result=$data.result,data=$data.data,$escape=$helpers.$escape,$out='';if(result){
$out+=' ';
if(data.info.vipUser){
$out+='  <div class="logged-in"> <div class="user-profile"> <div class="user-profile__pic"> <a href="javascript:;"><img src="http://dl.vip.yy.com/yyvippicture/webvipcom/1.jpg" alt="" id="userAvatar"></a> </div> <div class="user-profile__name"> ';
$out+=$escape(data.nick);
$out+=' </div> <div class="user-profile__link"> <a href="/p/profile/index.html" target="_self">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> <div class="user-profile__level"> <i class="vip-level v';
$out+=$escape(data.info.vipLevel);
$out+='"></i> ';
if(data.info.vipLevel < 8){
$out+=' ';
if(data.info.feeType == 0){
$out+=' <i class="icon-month"></i> ';
}else if(data.info.feeType == 1){
$out+=' <i class="icon-year"></i> ';
}else{
$out+=' <i class="icon-seasion"></i> ';
}
$out+=' ';
}
$out+=' <i id="iconPurple"></i>  </div> </div> <div class="vip-progress"> <div class="vip-progress__txt"> 等级 : Lv.';
$out+=$escape(data.info.vipLevel);
$out+='<span class="vip-progress__txt__gray">(';
$out+=$escape(data.info.score);
$out+='/';
$out+=$escape(data.info.lvScore);
$out+=')</span>  </div> <div class="vip-progress__bar"><span style="width:';
$out+=$escape(data.info.lvRate);
$out+='%"></span></div> <div class="vip-progress__txt"> 成长率 : ';
$out+=$escape(data.info.incPerDay);
$out+='点/天 ';
if(data.info.incPerDay !=20){
$out+=' <a href="/vip/pay" class="user-profile-common__btn" target="_blank">加速</a> ';
}
$out+=' </div> <div class="vip-progress__txt"> 会员到期 : ';
$out+=$escape(data.info.expireTime);
$out+=' <a href="/vip/pay" class="user-profile-common__btn" target="_blank">续费</a> </div> ';
if(data.info.owVip){
$out+=' <div class="vip-progress__txt"> OW会员到期 : ';
$out+=$escape(data.info.owVipExpireTime);
$out+=' <a href="/vip/vmall2/owvippay" class="user-profile-common__btn" target="_blank">续费</a> </div> ';
}
$out+=' <a class="not-purple-popup" href="http://vip.yy.com/vip/redirect?src=pay.yyvip" target="_blank"> 紫钻每日会员成长加成<strong>最高15点</strong>!<br/>另享积分、Y秀等多种特权&nbsp;&nbsp;开通&gt;&gt; </a> </div> ';
if(data.leftDays < 8){
$out+=' <div class="logged-in__renew"> <p>尊贵的VIP用户,您的会员资格快到期,请进行续费.</p> <a href="/vip/pay" target="_blank" class="logged-in__renew__btn">续费会员</a> <a href="javascript:;" class="logged-in__renew_close" id="loggedInRenewClose">&times;</a> </div> ';
}
$out+=' </div>  ';
}else{
$out+='  <div class="logged-in"> <div class="user-profile"> <div class="user-profile__pic"> <a href="javascript:;"><img src="http://dl.vip.yy.com/yyvippicture/webvipcom/1.jpg" alt="" id="userAvatar"></a> </div> <div class="user-profile__name"> ';
$out+=$escape(data.nick);
$out+=' </div> <div class="user-profile__link"> <a href="/p/profile/index.html" target="_self">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> <div class="user-profile__level"> <i class="vip-level v1-gray"></i><i class="icon-year-gray"></i> </div> </div> <div class="login-box__apply"><a href="/vip/pay" target="_blank">开通会员</a></div> <ul class="login-box__info"> <li><i class="icon1"></i>年费会员尊享20点/天，加速300%</li> <li><i class="icon2"></i>季费会员尊享10点/天，加速100%</li> </ul> </div>  ';
}
$out+=' ';
}else{
$out+='  <div class="not-logged-in"> <div class="login-box"> <div class="login-box__login"><i></i><a href="javascript:;" onclick="showUdbLogin();">登录</a>查看更多信息</div> <div class="login-box__txt">开通YY会员享受30多种会员特权</div> <div class="login-box__apply"><a href="/vip/pay" target="_blank">开通会员</a></div> <ul class="login-box__info"> <li><i class="icon1"></i>年费会员尊享20点/天，加速300%</li> <li><i class="icon2"></i>季费会员尊享10点/天，加速100%</li> </ul> </div> </div>  ';
}
$out+=' <div class="bright-box" data-edt-pid="2" data-edt-mode="0">  </div>';
return new String($out);
});});