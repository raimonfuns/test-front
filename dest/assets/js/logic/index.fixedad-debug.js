/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/index.fixedad-debug",["../lib/jquery.min-debug","../mod/fixAside-debug"],function(a,b,c){function d(a){e.ajax({url:"http://hd.vip.yy.com/1503y8/getLatestChannelInfo",type:"GET",async:!0,cache:!1,dataType:"jsonp",success:a})}var e=jQuery=a("../lib/jquery.min-debug"),f=a("../mod/fixAside-debug");d(function(a){if(a.result){var b='<div id="asidead" style="position: fixed;top:200px;right:0;width:159px;height:252px;font-family: Microsoft YaHei,Apple LiGothic Medium,SimHei, LiSong Pro Light,SimSun;"><div style="margin-left:30px;"><img src="'+a.data.logoUrl+'" alt="头像" style="width:100px;height:100px;"/></div><div style="width:159px;height:252px;position:absolute;top:0;left:0;background:transparent url(http://file.do.yy.com/group3/M00/5A/9C/tz0GSFUeUPOAfjYEAAAk-rFdi1E904.png) no-repeat 0 0;font-size:14px;color: #fff;font-family: "Microsoft YaHei","Apple LiGothic Medium","SimHei", "LiSong Pro Light","SimSun";"><p style="margin-top:164px;margin-left:20px;width:110px;text-align:center;height:18px;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;">主播<span style="color:#eef66c">'+a.data.name+'</span></p><p style="margin-left:20px;width:110px;height:18px;text-align:center;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;">给大家发红包</p><a target="_blank" style="display:block;margin:10px 0 0 29px;text-align:center;width:102px;height:25px;border-bottom:5px solid #d0db17;background-color:#eef66c;text-align:cener;line-height:30px;" href="'+a.data.url+'">点击领取</a></div></div>';e("body").append(b),new f("#asidead",0)}})});