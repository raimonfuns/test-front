/*! Project: vip
 *  Version: 1.0.0
 *  Date: 2015-07-20 02:03:34 PM
 *  Author: 
 */define("/assets/js/aralejs/plugins/easing",["../../lib/jquery.min"],function(a,b,c){var d=Math.PI,e=Math.pow,f=Math.sin,g=1.70158,h={easeNone:function(a){return a},easeIn:function(a){return a*a},easeOut:function(a){return(2-a)*a},easeBoth:function(a){return(a*=2)<1?.5*a*a:.5*(1- --a*(a-2))},easeInStrong:function(a){return a*a*a*a},easeOutStrong:function(a){return 1- --a*a*a*a},easeBothStrong:function(a){return(a*=2)<1?.5*a*a*a*a:.5*(2-(a-=2)*a*a*a)},backIn:function(a){return 1===a&&(a-=.001),a*a*((g+1)*a-g)},backOut:function(a){return(a-=1)*a*((g+1)*a+g)+1},backBoth:function(a){var b=g,c=(b*=1.525)+1;return(a*=2)<1?.5*a*a*(c*a-b):.5*((a-=2)*a*(c*a+b)+2)},elasticIn:function(a){var b=.3,c=b/4;return 0===a||1===a?a:-(e(2,10*(a-=1))*f(2*(a-c)*d/b))},elasticOut:function(a){var b=.3,c=b/4;return 0===a||1===a?a:e(2,-10*a)*f(2*(a-c)*d/b)+1},elasticBoth:function(a){var b=.45,c=b/4;return 0===a||2===(a*=2)?a:1>a?-.5*e(2,10*(a-=1))*f(2*(a-c)*d/b):e(2,-10*(a-=1))*f(2*(a-c)*d/b)*.5+1},bounceIn:function(a){return 1-h.bounceOut(1-a)},bounceOut:function(a){var b,c=7.5625;return b=1/2.75>a?c*a*a:2/2.75>a?c*(a-=1.5/2.75)*a+.75:2.5/2.75>a?c*(a-=2.25/2.75)*a+.9375:c*(a-=2.625/2.75)*a+.984375},bounceBoth:function(a){return.5>a?.5*h.bounceIn(2*a):.5*h.bounceOut(2*a-1)+.5}};c.exports=h;var i=jQuery=a("../../lib/jquery.min");i.extend(i.easing,h)});