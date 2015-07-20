/*<TMODJS> <MD5:fcfb061c6974d81f62fc65c8d5c5955e>*/
define(function(require){return require('./template')('vip-info', function($data,$id
/**/) {
var $helpers=this,result=$data.result,data=$data.data,$escape=$helpers.$escape,$out='';if(result && data != null){
$out+=' <img class="info-logo" src=""/> <p class="no-wrap ';
if(data.info.vipUser){
$out+='vip-nick';
}
$out+='" title="';
$out+=$escape(data.nick);
$out+='">';
$out+=$escape(data.nick);
$out+='</> <div> ';
if(data.info.vipUser){
$out+=' <span class="icon-lv vip-lv_';
$out+=$escape(data.info.vipLevel);
$out+='"></span><span class="icon-lv vip_';
$out+=$escape(data.info.feeType);
$out+='"></span> ';
}else{
$out+=' <span class="icon-lv vip-lv_';
$out+=$escape(data.info.vipLevel);
$out+='-gray"></span><span class="icon-lv vip_';
$out+=$escape(data.info.feeType);
$out+='-gray"></span> ';
}
$out+=' </div> ';
}else{
$out+=' <a href="javascript:;" class="my-login login-btn">我要登录</a> ';
}
return new String($out);
});});