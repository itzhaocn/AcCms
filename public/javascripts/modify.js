function Modify(opt){
	this.webId=opt.webId;
	this.bg=opt.bg;
	this.width=opt.width;
	this.height=opt.height;
	this.bgColor=opt.bgColor;
	this.posts=opt.posts;
	this.modId=0;
}

Modify.prototype.init=function(){
	$("#wrap").css({"width":this.width+"px","margin-left":-this.width/2+'px',"height":this.height+"px"});
	$("#preview").css({"background-color":this.bgColor,"height":this.height+"px"});
	this.setBg();
	var items=this.posts.split("||"),
		n=items.length-1;
	if(n<1){
		return false;
	}
	for(var i=0;i<n;i++){
		var array=items[i].split(","),
			opts={},
			m=array.length-1;
		for (var j=0;j<m;j++){
			var opt=array[j].split(":^");
			opts[opt[0]]=opt[1];
		}
		this.createView("modify"+this.modId,opts["type"],opts);
		this.modId++;
	}
}

Modify.prototype.setBg=function(){
	var bg=this.bg.split("**"),
		bgImg=bg[bg.length-1].split("::");
	var html='<div style="background:url(/html/'+this.webId+'/img/'+bgImg[0]+') no-repeat center 0;height:'+bgImg[1]+'px;"></div>'
	$("#bgBox").append(html);
}

Modify.prototype.createView=function(id,type,opts){
	var addCon='<div class="mod ui-widget-content ui-resizable" id="'+id+'" data-type="'+type+'" style="position:absolute;width:'+opts['width']+'px;height:'+opts['height']+'px;left:'+opts['left']+'px;top:'+opts['top']+'px;">'
				+'<span class="mod_type">'+type+'</span><br/>'
				+'<span class="mod_modfiy">修改</span>'
				+' <span class="mod_del">删除</span>'
				+'</div>';
	$("#wrap").append(addCon);
	$("#"+id).resizable({
		stop: function( event, ui ) {
			$("#"+id).data("width",ui.size.width);
			$("#"+id).data("height",ui.size.height);
		}
	});
	$("#"+id).draggable({
		stop:function(event,ui){
			$("#"+id).data("left",ui.position.left);
			$("#"+id).data("top",ui.position.top);
		}
	});
	$("#"+id).data(opts);

}









