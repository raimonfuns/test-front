/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/template",["../lib/jquery.min","../lib/template.min"],function(a,b,c){var d=jQuery=a("../lib/jquery.min"),e=a("../lib/template.min"),f={list:["a","b","c"]};d(document).ready(function(){console.log(e("tpl-mainslide",f)),d("body").append(e("tpl-mainslide",f))})});