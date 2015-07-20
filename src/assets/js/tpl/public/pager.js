/*<TMODJS> <MD5:0f83a3dcad34abf5392b099132d78fd0>*/
define(function(require){return require('./template')('pager', function($data,$id
/**/) {
var $helpers=this,currentPage=$data.currentPage,$escape=$helpers.$escape,$each=$helpers.$each,val=$data.val,$index=$data.$index,totalPages=$data.totalPages,$out='';$out+=' ';
if(currentPage == 1){
$out+=' <a href="javascript:;" data-pageno="1" rel="prev" title="上一页" class="lround current">上一页</a> <a href="javascript:;" data-pageno="1" class="current">1</a> ';
}else{
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage-1);
$out+='" rel="prev" title="上一页" class="lround">上一页</a> <a href="javascript:;" data-pageno="';
$out+=$escape(1);
$out+='">1</a> ';
}
$out+=' ';
if(currentPage - 1 > 4 ){
$out+=' <span>...</span> ';
$each([3,2,1],function(val,$index){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage - val);
$out+='">';
$out+=$escape(currentPage - val);
$out+='</a> ';
});
$out+=' ';
if(currentPage < totalPages ){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage);
$out+='" class="current">';
$out+=$escape(currentPage);
$out+='</a> ';
}
$out+=' ';
}else{
$out+=' ';
$each([2,3,4,5,6,7,8],function(val,$index){
$out+=' ';
if(currentPage >= 1 && val < totalPages ){
$out+=' ';
if( currentPage == val){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(val);
$out+='" class="current">';
$out+=$escape(val);
$out+='</a> ';
}else{
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(val);
$out+='">';
$out+=$escape(val);
$out+='</a> ';
}
$out+=' ';
}
$out+=' ';
});
$out+=' ';
}
$out+=' ';
if(totalPages - currentPage > 4 ){
$out+=' ';
$each([1,2,3],function(val,$index){
$out+=' ';
if(currentPage > 5 && currentPage + val < totalPages){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage + val);
$out+='">';
$out+=$escape(currentPage + val);
$out+='</a> ';
}
$out+=' ';
});
$out+=' <span>...</span> ';
}else{
$out+=' ';
$each([1,2,3],function(val,$index){
$out+=' ';
if(currentPage > 5 && currentPage + val < totalPages){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage + val);
$out+='">';
$out+=$escape(currentPage + val);
$out+='</a> ';
}
$out+=' ';
});
$out+=' ';
}
$out+=' ';
if(totalPages <= 1){
$out+=' <a href="javascript:;" data-pageno="1" rel="next" title="下一页" class="rround current">下一页</a> ';
}else{
$out+=' ';
if(currentPage == totalPages){
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(totalPages);
$out+='" class="current">';
$out+=$escape(totalPages);
$out+='</a> <a href="javascript:;" data-pageno="';
$out+=$escape(totalPages);
$out+='" rel="next" title="下一页" class="rround current">下一页</a> ';
}else{
$out+=' <a href="javascript:;" data-pageno="';
$out+=$escape(totalPages);
$out+='">';
$out+=$escape(totalPages);
$out+='</a> <a href="javascript:;" data-pageno="';
$out+=$escape(currentPage + 1);
$out+='" rel="next" title="下一页" class="rround ">下一页</a> ';
}
$out+=' ';
}
return new String($out);
});});