/**
juqery　ajax加载时屏蔽操作区 加入context
eg
$.ajax({
      url: '/service/web/treasureHouse/showProduct',
      dataType: 'json',
      context:{maskId:'testArea'}
    })

屏蔽 对话框中的按钮
$.ajax({
      url: '/service/web/treasureHouse/showProduct',
      dataType: 'json',
      context: {
        maskdialog: {
          id: 'testDia',
          button: ['btn-ok'],
        }
      }
    })
**/

define(function(require, exports, module) {

  var $ = require('../lib/jquery.min.js');
  $.ajaxSetup({
    beforeSend: function() {
      if (this.maskId && typeof(this.maskId) == 'string') {
        addMask(document.getElementById(this.maskId));
      }
      if (this.maskId && typeof(this.maskId) == 'object') {
        addMask(this.maskId);
      }
      if (this.maskdialog && typeof(this.maskdialog) == 'object') {
        disableDialogButton(this.maskdialog);
      }
    },
    complete: function() {
      if (this.maskId && typeof(this.maskId) == 'string') {
        removeMask(document.getElementById(this.maskId));
      }
      if (this.maskId && typeof(this.maskId) == 'object') {
        removeMask(this.maskId);
      }
      if (this.maskdialog && typeof(this.maskdialog) == 'object') {
        removeDisable(this.maskdialog);
      }
    },
    error: function() {}
  });

  function disableDialogButton(options) {
    require.async('./dialog/dialog', function(dialog) {
      for (var i = 0; i < options.button.length; i++) {
        dialog.get(options.id)._popup.find('[data-id=' + options.button[i] + ']').attr('disabled', 'true');
      }

    });
  }

  function removeDisable(options) {
    require.async('./dialog/dialog', function(dialog) {
      for (var i = 0; i < options.button.length; i++) {
        dialog.get(options.id)._popup.find('[data-id=' + options.button[i] + ']').removeAttr('disabled');
      }

    });
  }


  function addMask(domElement) {

    if (!domElement) {
      return;
    }


    // find X/Y position of domElement

    var $div = $('#ajaxmask');
    if ($div.length == 0) {
      $div = document.createElement('div');
      $div.id = 'ajaxmask';
      with($div.style) {
        position = 'absolute';
        //left = '' + $(domElement) + 'px';
        //top = '' + box.top + 'px';
        //width = '' + $(domElement).outerWidth() + 'px';
        //height = '' + $(domElement).outerHeight() + 'px';
        zIndex = 1999;
        filter = 'alpha(opacity=80)';
        opacity = 0.8;
        backgroundColor = '#000';
        backgroundImage = 'url(http://dl3.vip.yystatic.com/yyvippicture/0bc6bca0cf7615f8c1d7cfdda5c5f016.gif)';
        backgroundRepeat = 'no-repeat';
        backgroundPosition = 'center center';
      }

      $($div).appendTo('body');
    }
    var obj = $(domElement);
    var h = obj.outerHeight();
    $($div).css('line-height', h + 'px').width(obj.outerWidth()).height(h).show().offset(obj.offset());

  }

  function removeMask(elem) {

    $('#ajaxmask').hide()
  }

});