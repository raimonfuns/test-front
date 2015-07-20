/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/taskyyie-debug",["../lib/jquery.min-debug","../mod/jquery.cookie-debug","./login-debug","./date-debug"],function(a,b,c){function d(a,b){a==h&&e(a,b)}function e(a,b){g.getUserInfo(function(a){a&&a.result&&f.ajax({url:"http://task2.game.yy.com/task/finishTask.do?actId="+j+"&taskId="+k,type:"GET",async:!0,cache:!1,dataType:"jsonp",success:function(a){}})})}var f=jQuery=a("../lib/jquery.min-debug"),g=(a("../mod/jquery.cookie-debug"),a("./login-debug"));Array.prototype.indexOf||(Array.prototype.indexOf=function(a){for(var b=this,c=0;c<b.length;c++)if(b[c]==a)return c;return-1});var h="fromYYie",i=g.getMapFromURlParams(),j=(window.location.href,187),k=862;if(i)for(var l in i)d(l,i[l])});