/*<TMODJS> <MD5:edd00095c6fc0d05d8fb7120f68ab103>*/
define(function(require){return require('./template')('nicecodeLoginSider', function($data,$id
/**/) {
var $helpers=this,result=$data.result,data=$data.data,$escape=$helpers.$escape,$out='';if(result){
$out+=' ';
if(data.info.vipUser){
$out+='  <div class="logged-in"> <div class="user-profile"> <div class="user-profile__pic"> <a href="javascript:;"><img src="http://dl.vip.yy.com/yyvippicture/webvipcom/1.jpg" alt="" id="userAvatar"></a> </div> <div class="user-profile__name"> ';
$out+=$escape(data.nick);
$out+=' </div> <div class="user-profile__link"> <a href="/p/profile/index.html" target="_self">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> <div class="user-profile__level"> <i class="vip-level v';
$out+=$escape(data.info.vipLevel);
$out+='"></i> ';
if(data.info.feeType == 0){
$out+=' <i class="icon-month"></i> ';
}else if(data.info.feeType == 1){
$out+=' <i class="icon-year"></i> ';
}else{
$out+=' <i class="icon-seasion"></i> ';
}
$out+=' <i id="iconPurple"></i>  </div> </div> <div class="vip-progress"> <div class="vip-progress__txt"> 会员到期 : ';
$out+=$escape(data.info.expireTime);
$out+=' <a href="/vip/pay" target="_blank">续费</a> </div> <div class="vip-progress__txt"> 靓号商城 : &nbsp;<a href="/vip/nicecode/mine" target="_blank" class="nicecode-silder-link" >我的购买</a> </div> <div class="vip-progress__txt" style="padding-left:5em;"> <a href="/vip/nicecode/mine?ordertype=histroy" target="_blank" class="nicecode-silder-link" >我的订单(<label id="myOrderSize"></label>)</a> </div> <div class="vip-progress__txt"> 靓号代金券 : <a href="/vip/nicecode/mine?ordertype=coupon" target="_blank" style="float:none;color:#333;"><label id="myCouponSize"></label>张</a> <a href="/vip/nicecode/mine?ordertype=coupon" target="_blank">查看</a> </div> </div> ';
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
$out+=' <div class="bright-box"> <a href="http://hd.vip.yy.com/hdplatform/201411/2014111e4830.html" target="_blank"><img src="http://dl4.vip.yystatic.com/yyvippicture/7991f280729a6e06b2671e86a651b7df.jpg" alt="会员紫钻" ></a> </div>';
return new String($out);
});});