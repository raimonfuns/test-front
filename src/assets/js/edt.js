/***
 * 一点通平台广告处理
 * edt广告平台js
 * 在需要请求广告的地方加入tag即可
 * data-edt-pid 广告
 * data-edt-mode 0,纯图片,1,纯文字,2图片+文字
 * 附加 data-edit-show 表示加载数据的时候不占位,结束后才占位(可以忽略此属性)
 * init(_pids, _uid) 方法
 * 第一个参数是广告位置id数组
 * 第二个参数是用户uid如果没登陆，可以不传
 */

window.Edt = function() {

};
Edt.prototype.datas = {};
Edt.prototype.pidNeedActions = {};
Edt.prototype.pidActions = {};
Edt.prototype.delElements = [];
Edt.prototype.uid;
Edt.prototype.options = [];
Edt.prototype.pids = [];

Edt.prototype.init = function(_pids, _uid) {
	var uid = this.uid = _uid;
	var pids = this.pids = _pids;
	var pidNeedActions = this.pidNeedActions;
	var pidActions = this.pidActions;
	var delElements = this.delElements;
	var options = this.options;

	var $this = this;
	
	initEdtDatas();
	
	function initEdtDatas() {

		var edtShowElements = $(document).find("[data-edit-show]");
		edtShowElements.hide();
		var findPids = [];
		var edtElements = [];
		
		if (pids && pids.length >= 0) {
			for (var i = 0; i < pids.length; i++) {
				var epid = pids[i];
				var findElements = $(document).find("[data-edt-pid=" + epid + "]");
				edtElements = edtElements.concat(findElements);
			}
		} else {
			edtElements = $(document).find("[data-edt-pid]");
		}
		for (var i = 0; i < edtElements.length; i++) {
			var pid = $(edtElements[i]).data("edt-pid");
			findPids.push(pid);
			var option = getOptionBy(pid);
			if (!option) {
				option = [{
					pid: pid
				}];
				$this.regist(option)
			}
			if (!pidNeedActions[pid])
				pidNeedActions[pid] = 0;

			if (!pidActions[pid])
				pidActions[pid] = 0;

			pidNeedActions[pid] = pidNeedActions[pid] + 1;

			pidActions[pid] = pidActions[pid] + 1;
		}

		getEDT_positions(findPids, uid, function(rsp) {

			//console.log(rsp);
			$this.datas = rsp.data;
			var groupIndex = 0;
			for (var i = 0; i < edtElements.length; i++) {
				var pid = $(edtElements[i]).data("edt-pid");
				var mode = $(edtElements[i]).data("edt-mode");
				groupIndex++;
				var o = {
					$edtElement: $(edtElements[i]),
					pid: pid,
					mode: mode,
					groupIndex: groupIndex,
					action: function() {
						var context = this;
						var pid = this.pid;
						var mode = this.mode == undefined ? 0 : this.mode;

						//5秒超时处理
						var it = setTimeout(function() {
							pidNeedActions[pid] = pidNeedActions[pid] - 1; //完成一个
							delElements.push(context.$edtElement);
							ifComplete(pid, null);
						}, 5000);
						getEDT_position(pid, uid, function(rsp) {
							clearTimeout(it);
							var _pid = pid

							var item;
							if (rsp.result) {
								var data = [rsp.data];
								if (data) {
									for (var j = 0; j < data.length; j++) {
										item = data[j];
										var htmlStr = createHtml(mode, item, groupIndex);
										context.$edtElement.show();
										context.$edtElement.removeAttr("data-edit-show");
										if(htmlStr && htmlStr!="")
										{
											context.$edtElement.html(htmlStr);
										}
										else
										{
											context.$edtElement.hide();
											delElements.push(context.$edtElement);
										}
									}
								}
								//特殊广告位处理
								else {
									context.$edtElement.hide();
									delElements.push(context.$edtElement);
								}

							} else {
								context.$edtElement.hide();
								delElements.push(context.$edtElement);
							}
							pidNeedActions[pid] = pidNeedActions[pid] - 1;
							if (item && !item.adId && item.rcmdViews && item.rcmdViews.length > 0) {
								ifComplete(pid, item.rcmdViews[0]);
							} else {

								ifComplete(pid, item);
							}


						});
					}
				};
				o.action();

			}

			$(document).on("click", "[edt-id]", function(rsp) {
				clickEDT_position($(this).attr("edt-id"), uid, $(this).attr("edt-url"), $(this).attr("edt-m"), $(this).attr("edt-link-type"));
			});


		});

		function createHtml(mode, item, groupIndex) {

			var pid = item.pid;
			var data = [item];
			var linkType = 0;
			if (!item.adId) {
				data = item.rcmdViews;
				linkType = 1;
			}
			var option = getOptionBy(item.pid);

			if (option && !option.more && data.length > 1)
				data = [data[0]];
			if (!data)
				return "";
				
			if (data.length == 0)
				return "";
				
			var html = '<div class="div-' + pid + '-edt-item' + groupIndex + '"  edt-group="' + pid + '">';
			var count = 0;
			for (var i = 0; i < data.length; i++) {
				item = data[i];
				count++;
				var display = "block";
				if (count > 1)
					display = "none";
				if (!item.targetDesc)
					item.targetDesc = item.link;

				if (!item.content)
					item.content = "宣传";

				var blank;
				if (item.targetDesc && item.targetDesc.indexOf("yy://") == -1) {
					blank = "_blank"
				} else {
					blank = "_self";
				}

				html += '<a class="a-' + pid + '-edt-item' + groupIndex + '-'+ i + '" style="display: ' + display + ';" edt-parent="' + pid + '"  id="' + pid + '-edt-item' + i + '" href="' + item.targetDesc + '" target="' + blank + '" edt-url="' + item.targetDesc + '" edt-m = "' + item.m + '"  edt-link-type="' + linkType + '" edt-id="' + item.adId + '">';
				//纯图片
				if (mode == 0) {
					if (item)
						html += '<img class="img-' + pid + '-edt-item' + groupIndex + '-'+ i + '" src="' + item.imgUrl + '" alt="' + item.content + '">';
				}
				//纯文字
				else if (mode == 1) {
					if (item.content)
						html += '<p class="p-' + pid + '-edt-item' + groupIndex + '-'+ i + '">' + item.content + '</p>'
				}
				//图片+文字
				else if (mode == 2) {
					if (item)
						html += '<img class="img-' + pid + '-edt-item' + groupIndex + '-'+ i + '" src="' + item.imgUrl + '" alt="' + item.content + '">';
					if (item.content)
						html += '<p class="p-' + pid + '-edt-item' + groupIndex + '-'+ i + '">' + item.content + '</p>'
				}
				html += '</a>';
			}

			html += '</div>';

			return html;
		}

		function ifComplete(pid, item) {
				var count = pidNeedActions[pid];
				var option = getOptionBy(pid);
				if (count > 0) return;
				for (var j = 0; j < delElements.length; j++) {
					try {
						if (delElements[j] && option.nullRemove)
						{
							option.deled = true;
							delElements[j].remove();
						}
					} catch (e) {

					}
				}
				delElements = [];

				if (option) {
					if (option.complete) {
						var count = pidActions[pid];
						for (var k = 0; k < count; k++) {
							if(option.deled!=true)
								option.complete(pid, item);
							else
								option.complete(pid, null);
						}
					}

				}

				//处理轮播
				var groupEle = $(document).find("[edt-group=" + pid + "]");
				for (var k = 0; k < groupEle.length; k++) {
					var groupItem = groupEle[k];
					var items = $(groupItem).find("[edt-parent=" + pid + "]");
					var sliders = new Sliders();
					sliders.init(items, 5000);
				}
			}
			//type 0 need ajax request

		function clickEDT_position(adId, uid, url, m, type) {
			uid = uid || 0;
			m = m || "0";
			if (type == 0) {
				$.ajax({
					url: "http://e.yy.com/service/throw/edt/throw/click2?uid=" + uid + "&id=" + adId + "&m=" + m,
					type: 'GET',
					async: false,
					dataType: 'jsonp',
					success: function(rsp) {
						if (rsp.result) {

						}
					}
				});
			}
			if (url && url.indexOf("yy://") == -1) {
				//window.open(url, "_blank");
			} else {
				//window.open(url,"_blank");
			}

		}

		function getEDT_position(pid, uid, callBack) {
			var rsp = {
				result: false
			};
			for (var key in $this.datas) {
				var o = $this.datas[key];
				if (o.pid == pid) {
					rsp.result = true;
					rsp.data = o;
					callBack(rsp);
					return;
				}

			}
			callBack(rsp);
			return rsp;
		}

		function getEDT_positions(pids, uid, callBack) {
			uid = uid || 0;
			var pidsStr = pids.join(",");
			$.ajax({
				url: "http://e.yy.com/service/throw/edt/throw/views",
				type: 'GET',
				cache: false,
				data: {
					uid: uid,
					pids: pidsStr
				},
				dataType: 'jsonp',
				success: callBack
			});
		}

		function getOptionBy(pid) {
			for (var key in options) {
				var item = options[key];
				if (item.pid == pid)
					return item;
			}
			return null;
		}


	};

};
Edt.prototype.defaultOption = {
	nullRemove: false,
	more: true,
};
Edt.prototype.regist = function(_options) {
	for (var k = 0; k < _options.length; k++) {
		var op = _options[k];
		var d = $.extend({}, this.defaultOption);
		var op2 = $.extend(d, op);
		

		this.options.push(op2);
	}

};

//轮播
window.Sliders = function() {

};
Sliders.prototype.items;
Sliders.prototype.init = function(_items, _duration) {
	if (!_items) return;
	var $items = $(_items);
	this.items = $items;
	$items.hide();
	$($items[0]).show();
	var size = $items.length;
	var index = 0;
	setInterval(function() {
		index++;
		if (index >= size)
			index = 0;
		$items.hide();
		$($items[index]).show();
	}, _duration);
}
Sliders.prototype.destroy = function() {

}
