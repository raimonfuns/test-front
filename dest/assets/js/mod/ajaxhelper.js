/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/mod/ajaxhelper",["../lib/jquery.min"],function(require,exports,module){function disableDialogButton(a){require.async("./dialog/dialog",function(b){for(var c=0;c<a.button.length;c++)b.get(a.id)._popup.find("[data-id="+a.button[c]+"]").attr("disabled","true")})}function removeDisable(a){require.async("./dialog/dialog",function(b){for(var c=0;c<a.button.length;c++)b.get(a.id)._popup.find("[data-id="+a.button[c]+"]").removeAttr("disabled")})}function addMask(domElement){if(domElement){var $div=$("#ajaxmask");if(0==$div.length){with($div=document.createElement("div"),$div.id="ajaxmask",$div.style)position="absolute",zIndex=1999,filter="alpha(opacity=80)",opacity=.8,backgroundColor="#000",backgroundImage="url(http://dl3.vip.yystatic.com/yyvippicture/0bc6bca0cf7615f8c1d7cfdda5c5f016.gif)",backgroundRepeat="no-repeat",backgroundPosition="center center";$($div).appendTo("body")}var obj=$(domElement),h=obj.outerHeight();$($div).css("line-height",h+"px").width(obj.outerWidth()).height(h).show().offset(obj.offset())}}function removeMask(a){$("#ajaxmask").hide()}var $=require("../lib/jquery.min");$.ajaxSetup({beforeSend:function(){this.maskId&&"string"==typeof this.maskId&&addMask(document.getElementById(this.maskId)),this.maskId&&"object"==typeof this.maskId&&addMask(this.maskId),this.maskdialog&&"object"==typeof this.maskdialog&&disableDialogButton(this.maskdialog)},complete:function(){this.maskId&&"string"==typeof this.maskId&&removeMask(document.getElementById(this.maskId)),this.maskId&&"object"==typeof this.maskId&&removeMask(this.maskId),this.maskdialog&&"object"==typeof this.maskdialog&&removeDisable(this.maskdialog)},error:function(){}})});