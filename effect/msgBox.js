//弹窗
function msgBox(id,pos){
	if(pos=="true"){
		$(window).scrollTop(0);
	}
	winLocationForIe6(id);
	$(window).scroll(function(){
		winLocationForIe6(id);
	})
	$(window).resize(function(){
		winLocationForIe6(id);
	})
	function winLocationForIe6(){
		if($.browser.msie && $.browser.version == 6.0){
			if($("body").height()>$(window).height()){
				$("#shade").height($("body").height());
			}else{
				$("#shade").height($(window).height());
			}
			var w=$("#"+id).width(),
				h=$("#"+id).height(),
				top=$(window).scrollTop()+$(window).height()/2-h/2,
				left=$(window).scrollLeft()+$(window).width()/2-w/2;
			$(".win").each(function(){
				if($(this).css("display")=="block"){
					$(this).css({"top":top+"px","left":left+"px"});
				}
			})
			if($(window).width()<=$("#wrap").width()){
				$("#shade").width($("#wrap").width());
			}else{
				$("#shade").css("width","100%");
			}
		}
	}
	$(".win_close").click(function(){
		$(this).parent().hide();
		$("#shade").hide();
	})
};

module.exports = msgBox;



