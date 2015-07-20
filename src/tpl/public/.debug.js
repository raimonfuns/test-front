/*! <DEBUG:./loginSider> */
function anonymous($data,$id) {var $helpers=this,result=$data.result,data=$data.data,$escape=$helpers.$escape,$out='';if(result){
$out+=' ';
if(data.info.vipUser){
$out+='  <div class="logged-in"> <div class="user-profile"> <div class="user-profile__pic"> <a href="javascript:;"><img src="http://art.yypm.com/60x60" alt="" id="userAvatar"></a> </div> <div class="user-profile__name"> ';
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
$out+=' ';
if(data.purpleInfo.vipUser){
$out+=' <i class="icon-show"></i> ';
$out+=$escape();
$out+='  </div> </div> <div class="vip-progress"> <div class="vip-progress__txt"> 等级 : Lv.';
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
$out+=' <a href="/vip/pay" target="_blank">加速</a> ';
}
$out+=' </div> <div class="vip-progress__txt"> 会员到期 : ';
$out+=$escape(data.info.expireTime);
$out+=' <a href="/vip/pay" target="_blank">续费</a> </div> </div> ';
if(data.leftDays < 8){
$out+=' <div class="logged-in__renew"> <p>尊贵的VIP用户,您的会员资格快到期,请进行续费.</p> <a href="/vip/pay" target="_blank" class="logged-in__renew__btn">续费会员</a> <a href="javascript:;" class="logged-in__renew_close" id="loggedInRenewClose">&times;</a> </div> ';
}
$out+=' </div>  ';
}else{
$out+='  <div class="logged-in"> <div class="user-profile"> <div class="user-profile__pic"> <a href=""><img src="http://art.yypm.com/60x60" alt=""></a> </div> <div class="user-profile__name"> ';
$out+=$escape(data.nick);
$out+=' </div> <div class="user-profile__link"> <a href="/p/profile/index.html" target="_self">[个人中心]</a><a href="javascript:;" onclick="udbLogout();">[退出]</a> </div> <div class="user-profile__level"> <i class="vip-level v1-gray"></i><i class="icon-year-gray"></i> </div> </div> <div class="login-box__apply"><a href="/vip/pay" target="_blank">开通会员</a></div> <ul class="login-box__info"> <li><i class="icon1"></i>年费会员尊享20点/天，加速300%</li> <li><i class="icon2"></i>季费会员尊享10点/天，加速100%</li> </ul> </div>  ';
}
$out+=' ';
}else{
$out+='  <div class="not-logged-in"> <div class="login-box"> <div class="login-box__login"><i></i><a href="javascript:;" onclick="showUdbLogin();">登录</a>查看更多信息</div> <div class="login-box__txt">开通YY会员享受30多种会员特权</div> <div class="login-box__apply"><a href="/vip/pay" target="_blank">开通会员</a></div> <ul class="login-box__info"> <li><i class="icon1"></i>年费会员尊享20点/天，加速300%</li> <li><i class="icon2"></i>季费会员尊享10点/天，加速100%</li> </ul> </div> </div>  ';
}
$out+=' <div class="bright-box"> <a href="http://show.vip.yy.com" target="_blank"><img src="/assets/img/zizhuan.png" alt="会员紫钻" ></a> </div>';
return new String($out);}