define(function(require, exports, module) {
	var $ = jQuery = require("../../lib/jquery.min.js");
	var template = require("../../lib/template.min.js");
	//require('../../mod/screenWatch');
	require('../../mod/header');
	require('../../mod/loginSider');
	var Slide = require('../../aralejs/slide');
	//var dialog = require("../../mod/dialog/dialog");

	function banner() {
		slide = new Slide({
			element: '#slideS1',
			duration: 300,
			effect: 'fade',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers: true,
			triggers: ".ui-switchable-trigger",
			activeTriggerClass: 'active'
		}).render();
	};

	function fixedBtn (){
		var btnBox=$('.ui-switchable-nav');
		var li=btnBox.find('>li');
		var w=(btnBox.outerWidth()-li.length)/li.length
		li.css({width:w});
		li.parent().show();
		banner();
		btnBox=li=w=null;
	};
	fixedBtn ();

	function goods(box,btn) {
		slide = new Slide({
			element: box,
			duration: 300,
			effect: 'scrollx',
			easing: 'easeOutStrong',
			autoplay: true,
			hasTriggers: false,
			triggers: btn,
			activeTriggerClass: 'curr'
		}).render();
	};
	//goods('#nameplate','#nameplate-btn>li');
	//goods('#card-block','#card-block-btn>li');

	

	var style={
		width: '283px',
		height: '378px',
		position: 'absolute',
		backgroundColor: '#fff',
		boxShadow: '0 0 15px #888',
		zIndex: 99
	};
	var html;
	function CardPopShow (img){
		html=$('<div id="pop-card"><img class="pop-card-loading" src="http://show.yy.com:85/assets/img/ajaxloaderbig.gif" alt=""></div>').css(style);
		var image=new Image();
		image.src=img;
		image.alt='';
		$('body').append(html);
		if (image.complete) {
			html.html(image);
		}else{
			image.onload=function(){
				html?html.html(image):'';
			}	
		};
		
	};
	function CardPopHide(){
		html.remove();
		html=null;
	}


	function exchange(obj) {
		loadingPop();
		$.ajax({
			url:'http://show.yy.com:85/service/web/dressupcenter/exchange',
	    	type:'GET',
	    	cache: false,
	    	data:{pid:obj.pid,dressUpType:obj.type},
	    	dataType:'json',
	    	success:function(json){
	    		closePrompt();
	    		if (json.result) {
	    			if (obj.y) obj.y();
	    		}else{
	    			prompt(json.desc);
	    		};
	    	}
		});
	};
	function freeset(obj) {
		loadingPop();
		$.ajax({
			url:'http://show.yy.com:85/service/web/dressupcenter/freeset',
	    	type:'GET',
	    	cache: false,
	    	data:{pid:obj.pid,dressUpType:obj.type},
	    	dataType:'json',
	    	success:function(json){
	    		closePrompt();
	    		if (json.result) {
	    			if (obj.y) obj.y();
	    		}else{
	    			prompt(json.desc);
	    		};
	    	}
		});
	}

	function sendGift(note){
		$(note+' .gift').click(function(){
			var _this=$(this);
			sendOther(function(){
				var obj={
					pid:_this.attr('pid'),
					dressUpType:_this.attr('type'),
					imid:$('#pid').val()
				}
				if (/^\d{5,9}$/.test(obj.imid)) {
					closePrompt();
					fixGifts(obj.imid,_this.attr('price'),function(){
						loadingPop();
						$.ajax({
							url:'http://show.yy.com:85/service/web/dressupcenter/send',
					    	type:'GET',
					    	cache: false,
					    	data:obj,
					    	dataType:'json',
					    	success:function(json){
					    		closePrompt();
					    		if (json.result) {
					    			prompt('赠送成功，请通知你的好友到会员装扮站设置装扮^_^');
					    		}else{
					    			prompt(json.desc);
					    		};
					    		obj=null;
					    	}
						});
					},function(){
						_this.trigger('click');
					})
				}else{
					$('.tips-p').html('请输入正确的YY号');
				};
			});
		});
	}

	function convert(note) {
		$(note+' .exchange').click(function(){
			var _this=$(this);
			if (_this.attr('free')=='1') {
    			freeset({pid:_this.attr('pid'),type:_this.attr('type'),y:function(){
	   				prompt('兑换成功！');
	   			}});
    		}else{
    			fixgDress(_this.attr('price'),function(){;
	   				exchange({pid:_this.attr('pid'),type:_this.attr('type'),y:function(){
	   					prompt('兑换成功！');
	   				}});
	   			},function(){
	   			})
    		};
		})
	}

	$.ajax({
		url:'http://show.yy.com:85/service/web/dressupcenter/allstatuscards',
    	type:'GET',
    	cache: false,
    	dataType:'json',
    	success:function(json){
    		if (json.result) {
    			$('#name-plate-box').append(template('name-plate',{list:json.data}));
    			goods('#name-plate-bady','#nameplate-btn>li');
    			
    			sendGift('#name-plate-bady');

				convert('#name-plate-bady');
    		}else{
    			//prompt(json.desc);
    		};
    	}
	});

	$.ajax({
		url:'http://show.yy.com:85/service/web/dressupcenter/allspecialcards',
    	type:'GET',
    	cache: false,
    	dataType:'json',
    	success:function(json){
    		if (json.result) {
    			$('#name-cards-box').append(template('name-cards',{list:json.data}));
    			goods('#card-block','#card-block-btn>li');
    			$('.card-goods').mousemove(function(e){
					if (html) {
						html.css({left:e.pageX+25,top:e.pageY});
					}else{
						style.left=e.pageX+25;
						style.top=e.pageY;
						CardPopShow('http://show.yy.com:85/assets/img/dressup/show_card.jpg');
					};	
				}).mouseout(function(){
					CardPopHide();
				});

				sendGift('#card-block');

				convert('#card-block');

    		}else{
    			//prompt(json.desc);
    		};
    	}
	});

	var promptPop,promptPopMain,closePop,maskPop,btnBox,btnYes,btnNo,textBox;
	function prompt (pra,yes,no){
		var opt={
            text:'',
            btnYes:'确定',
            btnNo:'取消',
            closeBtn:true,
            mask:true,
            clpop:true,
            maskStyle:{
                width:'100%',
                height:'100%',
                backgroundColor:'#000',
                filter:'alpha(Opacity=40)',
                opacity: '0.4',
                position:'fixed',
                left:0,
                top:0,
                zIndex:1000
            }
        }
        if($.type(pra)==='string'){
            createNote(pra,yes,no);
        }
        if($.isPlainObject(pra)){
            $.extend(true,opt,opt,pra);
            createNote(opt.text,yes,no);
        }
        
        function createNote(word,yes,no){
            promptPop=$('<div class="pop-layout"></div>');
            promptPopMain=$('<div class="pop-layout-main"></div>');
            btnBox=(yes||no)?$('<div class="pop-btn-box"></div>'):null;
            
            if (yes) {
            	btnYes=$('<a href="javascript:;" class="pop-yes">'+opt.btnYes+'</a>');
            	btnBox.append(btnYes);
            }
            if (no) {
                btnNo=$('<a href="javascript:;" class="pop-no">'+opt.btnNo+'</a>');
                btnBox.append(btnNo);
            }
            textBox=$('<div class="pop-content">'+word+'</div>');
            promptPopMain.append(textBox).append(btnBox);
            if(opt.closeBtn){
            	closePop=$('<a class="close-pop" id="close-pop" href="javascript:;"></a>');
            	promptPopMain.append(closePop);
            } 
            promptPop.append(promptPopMain);
            setMask();
            $('body').append(promptPop.css({visibility:'hidden'}));
            promptPop.css({
            	marginLeft:-promptPop.outerWidth()/2,
            	marginTop:-promptPop.outerHeight()/2,
            	width:promptPop.outerWidth(),
            	visibility:''
            });
            bindEvent(yes,no);
            
        }
        function setMask(){
            if(opt.mask){
                maskPop=$('<div class="mask-pop"></div>').css(opt.maskStyle);
                $('body').append(maskPop);
            }
        }
        function bindEvent(y,n){
            if(opt.closeBtn){
            	 closePop.click(function(){
	            	closePrompt();
	            });
            }
            if (y) {
            	btnYes.click(function(){
                    if(opt.clpop) closePrompt();
                    if(y) y();
                });
            };
            if (n) {
            	btnNo.click(function(){
                    closePrompt();
                    if(n) n();
                });
            };
        }
	}
	function closePrompt(){
        if(maskPop) maskPop.remove();
        promptPop.remove();
        promptPop=promptPopMain=closePop=maskPop=btnBox=btnYes=btnNo=textBox=null;
    }

    function loadingPop() {
    	var obj={
    		text:'<img class="pop-card-loading" src="http://show.yy.com:85/assets/img/ajaxloaderbig.gif">',
    		closeBtn:false
    	}
    	prompt(obj);
    	obj=null;
    }
    function sendOther(y,n){
    	var obj={
    		text:'<dl class="send-pid-dl clearfix"><dt>受赠者YY号</dt><dd><input class="send-pid" id="pid" type="text"><p class="tips-p"></p></dd></dl>',
    		btnYes:'提交',
    		clpop:false
    	}
    	prompt(obj,y,n);
    	obj=null;
    }
    function fixGifts(pid,price,y,n){
    	var obj={
    		text:'你选择赠送给昵称为“ '+pid+' ”的好友，将消耗 '+price+' 张V卡',
    		btnNo:'返回修改'
    	}
    	prompt(obj,y,n);
    	obj=null;
    }
    function fixgDress(price,y,n){
    	var obj={
    		text:'你选择的会员装扮，将消耗 '+price+' 张V卡'
    	}
    	prompt(obj,y,n);
    	obj=null;
    }
    function showMyDressup(data){
    	var html,list='',way;
    	if (data) {
	    	for (var i = 0; i < data.length; i++) {
	    		list+='<tr><td>'+data[i].typeName+'</td><td>'+data[i].materialName+'</td><td>'+data[i].endTime.substring(0,9)+'</td><td><a class="table-btn set" href="javascript:;" type="'+data[i].dressType+'" pid="'+data[i].pid+'">设置</a><a class="table-btn rec" href="javascript:;" type="'+data[i].dressType+'">恢复默认样式</a></td></tr>';
	    	};
	    	html='<div class="pop-layout-header"><i>我的</i>装扮</div><div class="pop-layout-body my-dress-body"><table class="table-list" cellpadding="0" cellspacing="0"><colgroup width="25%"></colgroup><colgroup width="20%"></colgroup><colgroup width="20%"></colgroup><colgroup width="35%"></colgroup><tr><th>装扮类目</th><th>素材</th><th>有效期至</th><th></th></tr>'+list+'</table></div>';
    	}else{
    		html='<div class="pop-layout-header"><i>我的</i>装扮</div><div class="pop-layout-body my-dress-body">还没有装扮素材！</div>';
    	};
    	prompt(html);
    	html=list=null;
    }

    function showMyGifts(data){
    	var html,list='';
    	if (data) {
	    	for (var i = 0; i < data.length; i++) {
	    		list+='<tr><td>'+data[i].typeName+'</td><td>'+data[i].materialName+'</td><td>'+data[i].targetImid+'</td></tr>';
	    	};
	    	html='<div class="pop-layout-header"><i>我的</i>赠送</div><div class="pop-layout-body my-gifts-body"><table class="table-list" cellpadding="0" cellspacing="0"><colgroup width="25%"></colgroup><colgroup width="20%"></colgroup><colgroup width="20%"></colgroup><colgroup width="35%"></colgroup><tr><th>装扮类目</th><th>素材</th><th>赠送对象</th></tr>'+list+'</table></div>';
    	}else{
    		html='<div class="pop-layout-header"><i>我的</i>赠送</div><div class="pop-layout-body my-dress-body">还没有赠送过装扮素材！</div>';
    	};
    	prompt(html);
    	html=list=null;
    }

    
    function Request(obj){
    	$.ajax({
    		url:obj.url,
    		type:'GET',
    		data:obj.data,
    		dataType:'json',
    		success:function(json){
    			if(obj.key==1) dataDressup=json;
    			if (json.result) {
    				obj.s();
    			}else{
    				obj.f();
    			};
    		}
    	})
    }

	var test=[{typeName:'tom',materialName:'line',pid:'pay'},{typeName:'sam',materialName:'line',pid:'pay'},{typeName:'jack',materialName:'line',pid:'pay'}];
	var dataDressup
	$('.my-dressup').click(function(){
		loadingPop();
		$.ajax({
    		url:'http://show.yy.com:85/service/web/dressupcenter/mydressup',
    		type:'GET',
    		cache: false,
    		dataType:'json',
    		success:function(json){
    			closePrompt();
    			if (json.result) {
    				showMyDressup(json.data);
    				if (json.data) {
    					$('.set').click(function(){
    						var _this=$(this);
    						$.ajax({
    							url:'http://show.yy.com:85/service/web/dressupcenter/setdressup',
					    		type:'GET',
					    		cache: false,
					    		data:{dressUpType:_this.attr('type'),pid:_this.attr('pid')},
					    		dataType:'json',
					    		success:function(json){
					    			if (json.result) {
					    				_this.addClass('seted').removeClass('set').html('已设置');
					    			}else{
					    				//prompt(json.desc);
					    				alert(json.desc);
					    			};
					    			
					    		}
    						});
    					});
    					$('.rec').click(function(){
    						var _this=$(this);
    						$.ajax({
    							url:'http://show.yy.com:85/service/web/dressupcenter/resetdressup',
					    		type:'GET',
					    		cache: false,
					    		data:{dressUpType:_this.attr('type')},
					    		dataType:'json',
					    		success:function(json){
					    			if (json.result) {
					    				if (_this.siblings('seted')) {
					    					_this.siblings('seted').addClass('set').removeClass('seted').html('设置');
					    				};
					    				alert('恢复成功！');
					    			}else{
					    				prompt(json.desc);
					    			};
					    		}
    						});
    					});
    				};
    			}else{
    				prompt(json.desc);
    			};
    		}
    	});
	});
	$('.my-gifts').click(function(){
		loadingPop();
		$.ajax({
    		url:'http://show.yy.com:85/service/web/dressupcenter/mysend',
    		type:'GET',
    		cache: false,
    		dataType:'json',
    		success:function(json){
    			closePrompt();
    			if (json.result) {
    				showMyGifts(json.data);
    				if (true) {};
    			}else{
    				prompt(json.desc);
    			};
    		}
    	});
	});
	


	/*$(document).click(function(){
		dialog({
		    id: "dialogMsgBox",
			padding: "10px 15px",
			skin: "",
			width:'100%',
		    content: '呵呵呵',
		    okValue:'确定',
		    cancelValue:'取消',
		    ok:function(){
		    	
		    },
		    cancel:function(){

		    }
		}).showModal();
	});*/


});