/*<TMODJS> <MD5:47ba0657e3f5a16016ae6c25a8676b3b>*/
define(function(require){return require('./template')('dialyLuckyList', function($data,$id
/**/) {
var $helpers=this,$each=$helpers.$each,dailylottery=$data.dailylottery,v=$data.v,i=$data.i,$escape=$helpers.$escape,$out='';$out+=' <tbody> <tr> ';
$each(dailylottery,function(v,i){
$out+=' <td><a href="';
$out+=$escape(v.productLink);
$out+='" target="_blank"><img src="';
$out+=$escape(v.imgUrl);
$out+='"/><p>';
$out+=$escape(v.productName);
$out+='</p></a></td> ';
});
$out+=' <tr> <td><img src="/assets/img/welfare/thanks.png"></td> <td><a href="javascript:;" class="icon do-lucky login-btn" data-flag="0"></a></td> <td><img src="/assets/img/welfare/thanks.png"></td> </tr> <tr> <td><a href="http://photo.189.cn/jsp/website/activity/yy/yyindex.jsp?id=photo" target="_blank"><img src="http://dl1.vip.yystatic.com/yyvippicture/5ad3290ac7c0e8dfbda360a6f3e041ab.jpg"/><p>6寸20张晶锐照片冲印券</p></a></td> <td><a href="http://photo.189.cn/jsp/website/activity/yy/yyindex.jsp?id=74793908772670" target="_blank"><img src="http://dl3.vip.yystatic.com/yyvippicture/6fc584a23c8deeca9dcadc3b461b85db.jpg"/><p>定制拍立得明信片</p></a></td> <td><a href="http://photo.189.cn/jsp/website/activity/yy/yyindex.jsp?id=48790387251612" target="_blank"><img src="http://dl1.vip.yystatic.com/yyvippicture/db383993ef44eaffc781c3e022ddd7c4.jpg"/><p>卡通绕线器</p></a></td> </tr> </tbody>';
return new String($out);
});});