//QQ微博
function qqWeibo(btnId,textareaId){
	$("#"+btnId).click(function(){
		var _t = encodeURIComponent($("#"+textareaId).val());
		var _url = encodeURI(document.location);
		var _appkey = encodeURI("appkey");
		var _pic = encodeURI("");
		var _site = "";
		var _u = "http://v.t.qq.com/share/share.php?title="+_t+"&url="+_url+"&appkey="+_appkey+"&site="+_site+"&pic="+_pic;
		window.open( _u,"转播到腾讯微博", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no" );
		return false;
	});
};

module.exports = qqWeibo;