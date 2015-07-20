<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="Keywords" content="皇室,尊贵,个性,成长,等级,特权,功能,YY特权,游戏特权,YYvip,yy vip,YY会员,会员,YY,多玩,duowan">
    <meta name="description" content="YY会员为用户提供更加尊贵的服务，这里有动态表情、头像，还能让你在频道树排名靠前；还有尊贵的YY靓号、频道靓号，还有靓、豪图标，为您点亮，彰显身份；频道考核不达标，还有加油卡、复活卡，让你的频道无忧果考核！">
    <title>YY会员 - 我是会员 &quot;V&quot;力无限</title>
        <link href="${viphost}assets/css/base.css" rel="stylesheet">
    <link href="${viphost}assets/css/vip.css" rel="stylesheet">
    <script src="http://dl2.vip.yystatic.com/assets/js/sea2.0.0.js"></script>

</head>
<body>
    <div class="wrap index-wrap">
        <!-- vip-header {-->
        
<div class="vip-header">
    <div class="vip-header__inner">
        <div class="vip-header__logo"  style="position:relative; zoom:1; margin-left:-10px;">
        	<a target="_self" href="/vip/redirect?src=viphead"></a>
        </div>
        <ul class="vip-header__menu">
            <li><a href="/" target="_self">会员首页</a></li>
            <li><a href="/introductionsummary.html" target="_self" alllink="/vip/introduction|/p/privilege/introduction.html">会员特权</a><img src="http://dl1.vip.yystatic.com/yyvippicture/aada293afc16a87258fe8c9f85d48750.png" class="header-new-icon"/></li>
  <!--           <li><a href="/vip/game" target="_self">游戏特权</a></li> -->
            <li><a href="/p/nicecode/index.html" target="_self" alllink="/p/nicecode">靓号商城</a></li>
            <li><a href="/p/activity/index.html" target="_self">活动中心</a></li>
            <li><a href="http://show.vip.yy.com" target="_blank"><i class="purple-icon"></i>YY紫钻</a></li>
            <li><a href="/vip/pay" target="_blank">支付中心</a></li>
            <li><a href="http://hd.vip.yy.com/1506d8/index" target="self">PK互动</a></li>
        </ul>
        
        <div class="vip-header__login" id="loginArea">

        </div>
       
    </div>
</div>

        <!--} vip-header -->

        <div class="wp-main clearfix">
            <div class="col-side">

                <!-- 登录后 {-->
                <div id="loginSider"></div>
                <!-- } 登录后 -->

                <!-- 特权设置 {-->
                <div class="box">
    <div class="box__hd">
        <h3 class="box__hd__title">特权设置</h3>
        <div class="box__hd__act">
            <a class="box__hd__more" href="/p/profile/myprivilege.html" target="_self">更多»</a>
        </div>
    </div>
    <div class="box__bd">
        <ul class="setting-list">
            <li><a href="/p/profile/myprivilege.html#0" target="_blank">
                 <span class="setting-list__config"><i></i>设置</span>
                <span class="setting-list__tit"><i class="setting-list__icon1"></i>会员红名</span>
            </a></li>
            <li><a href="/p/profile/myprivilege.html#1" target="_blank">
                <span class="setting-list__config"><i></i>设置</span>
                <span class="setting-list__tit"><i class="setting-list__icon2"></i>会员皮肤</span>
            </a></li>
            <li><a href="/p/profile/myprivilege.html#2" target="_blank">
                <span class="setting-list__config"><i></i>设置</span>
                <span class="setting-list__tit"><i class="setting-list__icon3"></i>动态头像</span>
            </a></li>
            <li><a href="/p/profile/myprivilege.html#3" target="_blank">
                <span class="setting-list__config"><i></i>设置</span>
                <span class="setting-list__tit"><i class="setting-list__icon4"></i>会员炫铃</span>
            </a></li>
            <li><a href="/p/profile/myprivilege.html#4" target="_blank">
                <span class="setting-list__config"><i></i>设置</span>
                <span class="setting-list__tit"><i class="setting-list__icon5"></i>在线特权</span>
            </a></li>
        </ul>
    </div>
</div>
                <!-- }特权设置 -->

            </div>
            <div class="col-main">

                <div class="slide-s3" id="slideS1">
                    <div class="slide__content" >
                        
                            
                            	<ul data-role="content">
                                <#list slideContent_json as item>
                                    <li class="slide__item"><a class="slide__item-link" href="${item.url}" target="_blank"><img src="${item.images}" alt="${item.desc}"></a></li>
                                </#list>
                                <li class="slide__item hidden" data-edt-pid="8" data-edit-show></li>
                                </ul>
                                 <ul class="ui-switchable-nav">
		                         	<#list slideContent_json as item>
		                        			<li class="ui-switchable-trigger"></li>
		                        	</#list>
		                        </ul>
                            
                        
                       
                    </div>
                   	
                   
                </div>

                <div class="box box--big privilege-box">
                    <div class="box__hd">
                        <h3 class="box__hd__title"><strong>等级</strong>特权</h3>
                        <div class="box__hd__act">
                            <a class="box__hd__more" href="/vip/introduction?type=0" target="_blank">更多»</a>
                        </div>
                    </div>
                    <div class="box__bd">
                        <ul class="pic-list--big">                        

                            
                                <#list privDJ_json as item>
                                    <li>
                                        <a href="${item.url}" target="_blank" class="pic-list__pic">
                                            <img src="${item.images}" alt="${item.desc}">
                                            <span class="pic-list__mask"></span>
                                        </a>
                                    </li>
                                </#list>
                            
                        </ul>
                    </div>
                </div>

                <div class="box box--big privilege-box clearfix">
                    <div class="box__hd">
                        <h3 class="box__hd__title"><strong>炫耀</strong>特权</h3>
                        <div class="box__hd__act">
                            <a class="box__hd__more" href="/vip/introduction?type=1" target="_blank">更多»</a>
                        </div>
                    </div>
                    <div class="box__bd">
                        <ul class="pic-list--big" >
                            
                            
                                <#list privXY_json as item>
                                    <li>
                                        <a href="${item.url}" target="_blank" class="pic-list__pic">
                                            <img src="${item.images}" alt="${item.desc}">
                                            <span class="pic-list__mask"></span>
                                        </a>
                                    </li>
                                </#list>
                            
                        </ul>
                    </div>
                </div>

                <div class="box box--big privilege-box clearfix">
                    <div class="box__hd">
                        <h3 class="box__hd__title"><strong>基础</strong>特权</h3>
                        <div class="box__hd__act">
                            <a class="box__hd__more" href="/vip/introduction?type=2" target="_blank">更多»</a>
                        </div>
                    </div>
                    <div class="box__bd">
                        <ul class="pic-list--big">
                            
                            
                                <#list privJC_json as item>
                                    <li>
                                        <a href="${item.url}" target="_blank" class="pic-list__pic">
                                            <img src="${item.images}" alt="${item.desc}">
                                            <span class="pic-list__mask"></span>
                                        </a>
                                    </li>
                                </#list>
                            
                        </ul>
                    </div>
                </div>

                 <div class="box box--big privilege-box clearfix">
                    <div class="box__hd">
                        <h3 class="box__hd__title"><strong>实用</strong>特权</h3>
                        <div class="box__hd__act">
                            <a class="box__hd__more" href="/vip/introduction?type=3" target="_blank">更多»</a>
                        </div>
                    </div>
                    <div class="box__bd">
                        <ul class="pic-list--big">
                           
                             
                                <#list privSY_json as item>
                                    <li>
                                        <a href="${item.url}" target="_blank" class="pic-list__pic">
                                            <img src="${item.images}" alt="${item.desc}">
                                            <span class="pic-list__mask"></span>
                                        </a>
                                    </li>
                                </#list>
                            
                        </ul>
                    </div>
                </div>

            </div>
        </div>

        <!-- footer-nav {-->
         <div class="footer-nav">
    <div class="footer-nav__inner">
        <a class="footer-nav__item footer-nav__item01" href="/vip/pay" target="_blank">
            <i></i>
            <dl>
                <dt>快捷入口</dt>
                <dd>YY靓号</dd>
                <dd>快捷充值</dd>
            </dl>
        </a>
        <a class="footer-nav__item footer-nav__item02" href="http://bbs.yy.com/forum-1317-1.html" target="_blank">
            <i></i>
            <dl>
                <dt>会员论坛</dt>
                <dd>加入会员大家庭</dd>
                <dd>了解更多会员信息</dd>
            </dl>
        </a>
        <a class="footer-nav__item footer-nav__item03" href="http://kf.yy.com/faq/list/78-13.html" target="_blank" data-bdtj="/index/kf-icon">
            <i></i>
            <dl>
                <dt>YY客服</dt>
                <dd>有问题找客服</dd>
                <dd>帮您排忧解难</dd>
            </dl>
        </a>
    </div>
</div>
        <!--} footer-nav -->

        <!-- vip-footer {-->
        <div class="vip-footer">
    <div class="vip-footer__links">
        <a target="_blank" href="http://www.huanju.cn/s/introduction.html">关于欢聚</a>|<a target="_blank" href="http://hr.yy.com">欢聚招聘</a>|<a target="_blank" href="http://www.huanju.cn/s/contact.html">联系欢聚</a>|<a target="_blank" href="http://www.yy.com/go.html#10">客服频道：<strong>10</strong></a>|<a target="_blank" href="http://www.huanju.cn/s/links.html">友情链接</a>|<a target="_blank" href="http://kf.yy.com/">YY客服中心</a>
    </div>
    <div class="vip-footer__copy">
        <span>广州华多网络科技有限公司 版权所有 2005-2013 DuoWan.com [多玩游戏] 粤ICP备09075143号</span>|<span>备案编号：4401060102637</span>
    </div>
</div>


<script>
/*var _hmt = _hmt || [];
(function() {
  function loadJs(src){
  	var hm = document.createElement("script");
    hm.src = src;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  }
  loadJs("//hm.baidu.com/hm.js?1ad6c9f9d366b2902c847ffe231db6fb");
  loadJs("http://www.duowan.com/duowan.js");
})();*/
</script>
        <!--} vip-footer -->

    </div>

    <script>
        seajs.config({
            //alias: {
            //    "jQuery": "../lib/jquery-1.11.0.js"
            //}
            map : [
                [ /^(.*\.(?:js))(.*)$/i, '$1?_=20140811']
            ]
        })
        seajs.use(['${viphost}assets/js/logic/privilege/index']);

     </script>
</body>
</html>
