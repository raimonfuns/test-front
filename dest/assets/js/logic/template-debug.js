/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/template-debug",["../lib/jquery.min-debug","../lib/template.min-debug"],function(a,b,c){var d=jQuery=a("../lib/jquery.min-debug"),e=a("../lib/template.min-debug"),f={list:["a","b","c"]};d(document).ready(function(){console.log(e("tpl-mainslide",f)),d("body").append(e("tpl-mainslide",f))})});