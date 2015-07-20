/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/logic/nicecode/nicecodenav-debug",["../../lib/jquery.min-debug"],function(a,b,c){function d(a){var b="null";("undefined"==typeof a||null==a)&&(a=window.location.href);var c=/.*\:\/\/([^\/]*).*/,d=a.match(c);return"undefined"!=typeof d&&null!=d&&(b=d[1]),a.substring(a.indexOf(b)+b.length)}var e=jQuery=a("../../lib/jquery.min-debug");e(".nicecode-nav").find("a").each(function(a,b){var c=d();return 0==c.indexOf(e(b).attr("href"))?(e(b).addClass("active"),!1):void 0})});