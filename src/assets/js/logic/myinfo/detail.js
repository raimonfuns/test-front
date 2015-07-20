define(function(require, exports, module) {
		var $ = jQuery = require("../../lib/jquery.min.js");
		var myinfo = require('../../mod/myinfo');
		
		
		var header = require('../../mod/header');
		require('../../mod/screenWatch');
		var cookie = require("../../mod/jquery.cookie.js")
		var template = require('../../lib/template.min.js');
		
		Date.prototype.format =function(format)
		{
			var o = {
			"M+" : this.getMonth()+1, //month
			"d+" : this.getDate(), //day
			"h+" : this.getHours(), //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth()+3)/3), //quarter
			"S" : this.getMilliseconds() //millisecond
			}
			if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
			(this.getFullYear()+"").substr(4- RegExp.$1.length));
			for(var k in o)if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,
			RegExp.$1.length==1? o[k] :
			("00"+ o[k]).substr((""+ o[k]).length));
			return format;
		}
		
		var pageCount = 12;
		var cookieViewInfoIdsKey = 'VIEW_INFO_IDS';
		var cookieViewInfoIdsValue;
		
		header.completeHeader(function rsp(){	
			//已读
			myinfo.readAll();
			
		});
		
		var getMyInfos = function(page,pageSize) {
			$.ajax({
				url : "/service/web/user/getWebMails",
				dataType : "json",
				type : "GET",
				cache : false,
				context : this,
				data : {
					page:page,
					pageSize:pageSize
				},
				success : function(rsp) {
					cookieViewInfoIdsValue = $.cookie(cookieViewInfoIdsKey);
					if (rsp["result"]) {       
						var data = rsp.data.list;
						$("#box-msg-list-wrap").html(""); 
						for(var i = 0; i < data.length; i++){
							var o = data[i];
							var insertDateTime = new Date(o.m_time * 1000); //就得到普通的时间了
							var dateStr = insertDateTime.format("yyyy-MM-dd hh:mm");
							var trReadClass = "notread";
							if(cookieViewInfoIdsValue!=undefined && cookieViewInfoIdsValue.indexOf("myinfo_"+o.m_id)>-1)
							{
								trReadClass = "even read";
							}
							var item = '<tr class="'+trReadClass+'" id=myinfo_msg_tr_'+o.m_id+'> <td class="tb-general__name">'+o.m_from+'</td><td class="tb-general__txt"><a href="'+o.m_url+'"  id=myinfo_'+o.m_id+' class="viewInfo__href" target="_blank">'+o.m_title+'</a></td>  <td class="tb-general__date">'+dateStr+'</td></tr>';
							$("#box-msg-list-wrap").append(item);
						}
						var content = template("tpl-pager",rsp["data"]);
						$("#pager-wrap").html(content);
					} else {
						
					}
					$(".viewInfo__href").click(function(){
						cookieViewInfoIdsValue = $.cookie(cookieViewInfoIdsKey);
						if(cookieViewInfoIdsValue == undefined)
						{
							cookieViewInfoIdsValue = this.id;
						}
						else{
							if(cookieViewInfoIdsValue.indexOf(this.id)==-1)
								cookieViewInfoIdsValue+=this.id+",";
						}
						
						$.cookie(cookieViewInfoIdsKey,cookieViewInfoIdsValue,{path: '/'});
						var tr = $("#myinfo_msg_tr_"+this.id.split("_")[1]);
						
						//如果有class就表示没读
                        if(tr.hasClass("notread"))
                        {
                           $.ajax({
                                url: "/service/web/user/hitNum",
                                type: 'GET',
                                cache: false,
                                data: {
                                    mail: this.id.split("_")[1]
                                },
                                dataType: 'json',
                                success: function(rsp) {
                                }
                            });
                        }
						tr.removeClass("notread");
						tr.addClass("even read");
					}); 
				}
			});
		};
		
     	$("#pager-wrap").delegate('a','click',function(){
			
			if (!$(this).hasClass('current')) {

				getMyInfos($(this).data('pageno'),pageCount);
			}
		});
		
		getMyInfos(1,pageCount);
});