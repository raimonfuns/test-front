/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/flashavatar",["../lib/jquery.min","./swfobject"],function(a,b,c){var d=a("../lib/jquery.min"),e=a("./swfobject"),f="_flash_avatar_72x72_",g={},h={wmode:"transparent"},i={wmode:"transparent",style:"display:block;",play:!0,id:f};c.exports=function(a){function b(a,b){var j="undefined"!=typeof document.body.style.oBorderRadius||"undefined"!=typeof document.body.style.msBorderRadius||"undefined"!=typeof document.body.style.mozBorderRadius||"undefined"!=typeof document.body.style.webkitBorderRadius||"undefined"!=typeof document.body.style.borderRadius,k=d("#"+a);j?k.html('<img src="'+b+'" alt="头像" width="'+[c.size]+'px" height="'+[c.size]+'px"/>'):(0==d("#"+f).length&&k.html('<span id="'+f+'"></span>'),e.embedSWF(c.moviePath+"?imgUrl="+b,f,72,72,"9.0.0","/js/mod/expressInstall.swf",g,h,i))}var c={moviePath:"/assets/flash/circle.swf",size:72,inflash:!0,imgUrl:"",recordingUrl:"",code:0,hasBigAvatar:0};return c=d.extend(c,a),{embedCircleAvatar:b}}});