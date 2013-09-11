function Preview(){}

var modId=0;

Preview.prototype.init=function(){
	var self=this;
	self.move();
	self.setBtn();
	self.win();
	self.bgImg();
	self.unityClass();

	$(".mod_modfiy").live("click",function(){
		var tar=$(this);
		self.winModify(tar);
	})

	$(".mod_del").live("click",function(){
		var tar=$(this);
		self.modDelete(tar);
	})
}

//background
Preview.prototype.bgImg=function(){
	function fileSelect(e) {
		e = e || window.event;
		var files = e.target.files;  //FileList Objects    
		var ireg = /image\/.*/i,
			p = document.getElementById('bgBox');
		p.innerHTML="";
		var bg='';
		for(var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = (function(file) {
				return function(e) {
					var div = document.createElement('div');
						span=document.createElement('span');
					span.className="bg";
					var img = new Image;
					var src=this.result;
					img.alt=file.name;
					img.onload = function(){
						div.style.overflow='hidden';
						div.style.height=img.height+'px';
						bg+=file.name+':'+img.height+",";
						$("#bg").val(bg);
					};
					img.src=this.result;
					span.innerHTML = '<img class="thumb" src="'+ this.result +'" alt="'+ file.name +'" />';
					div.appendChild(span);
					div.style.background='url('+src+') no-repeat center 0';
					p.insertBefore(div);
				};
			})(f);
			//读取文件内容
			reader.readAsDataURL(f);
		}
	}
		 
	if(window.File && window.FileList && window.FileReader && window.Blob) {
		document.getElementById('files').addEventListener('change', fileSelect, false);
	} else {
		document.write('您的浏览器不支持File Api');
	}
}

Preview.prototype.unityClass=function(){
	$(".unity").change(function(){
		var obj=$(this).attr("data-obj"),
			val=$(this).val();
		switch(obj){
			case "height":
				$("#wrap").css("height",val+"px");
				$("#preview").css("height",val+"px");
			break;
			case "width":
				$("#wrap").css({"width":val+"px","margin-left":-val/2+'px'});
			break;
			case "bgColor":
				$("#preview").css("background-color",val);
			break;
		}
	})
}
Preview.prototype.setBtn=function(){
	var html='';
	for (var p in controlData){
		html+='<li><input type="button" name="" class="add" data-type="'+p+'" value="'+p+'" /></li>\n';
	}
	$("#setBg").after(html);
}

Preview.prototype.win=function(){
	var self=this;
	self.winObj=new MsgBox({
		skin: "msg_table",
		content: $("#winContent").html(),
		btns: null,
		btns:[ 
				{
					text:"确认" ,
					onClick:function(){
						self.winSubmit();
						self.winObj.hide();
					}
				},
				{
					text:"关闭" ,
					ads:"msg_bt_false",
					onClick:function(){self.winObj.hide();}
				}
			],
	})
	self.winModifyObj=new MsgBox({
		skin: "msg_table",
		content: $("#winModifyContent").html(),
		btns: null,
		btns:[ 
				{
					text:"确认" ,
					onClick:function(){
						self.winModifySubmit();
						self.winModifyObj.hide();
					}
				},
				{
					text:"关闭" ,
					ads:"msg_bt_false",
					onClick:function(){self.winModifyObj.hide();}
				}
			],
	})
}

Preview.prototype.winSubmit=function(){
	var type=$("#win input[name=type]").val(),
		array=controlData[type],
		opts={};
	for (var i=0;i<array.length;i++){
		var name=array[i];
		opts[name]=$('#win input[name='+name+']').val();
	}
	this.setPlace("mod"+modId,type,opts);
	modId++;
}

Preview.prototype.winModifySubmit=function(){
	var type=$("#winModify input[name=type]").val(),
		id=$("#winModify input[name=id]").val(),
		array=controlData[type],
		opts={};
	for (var i=0;i<array.length;i++){
		var name=array[i];
		opts[name]=$('#winModify input[name='+name+']').val();
		$("#"+id).data(name,opts[name]);
	}

	$("#"+id).remove();
	this.setPlace(id,type,opts);
}

Preview.prototype.setPlace=function(id,type,opts){
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

Preview.prototype.modDelete=function(e){
	e.parent().remove();
}

Preview.prototype.winModify=function(e){
	var type=e.parent().attr("data-type"),
		id=e.parent().attr("id"),
		array=controlData[type],
		opts={};
	for (var i=0;i<array.length;i++){
		var name=array[i];
		opts[name]=$('#'+id).data(name);
	}

	var content='<input type="hidden" name="type" value="'+type+'" />'
				+'<input type="hidden" name="id" value="'+id+'" />';
	for (var i=0;i<array.length;i++){
		var opt=array[i];
		content+='<div class="lh"><span>'+opt+':</span> <input type="text" name="'+opt+'" value="'+opts[opt]+'" /></div>';
	}
	$("#winModify").html(content);
	this.winModifyObj.show();
}


Preview.prototype.add=function(e){
	var type=e.attr("data-type");
	var content='<input type="hidden" name="type" value="'+type+'" />'
				+'<input type="hidden" name="id" value="'+modId+'" />';
	var array=controlData[type];
	for (var i=0;i<array.length;i++){
		var opt="width,height,left,top",defaultValue='';
		if(opt.split(",").indexOf(array[i])>=0){
			defaultValue=100;
		}
		content+='<div class="lh"><span>'+array[i]+':</span> <input type="text" name="'+array[i]+'" value="'+defaultValue+'" /></div>';
	}
	$("#win").html(content);
	this.winObj.show();
}

Preview.prototype.items=function(opt){
	var items=[];
	var i=0
	for(var p in opt){
		items[i]=p;
		i++;
	}
	return items;
}

Preview.prototype.submit=function(){
	var items=this.items(controlData),data='';
	for (var i=0;i<items.length;i++){
		var tarArray=$(".mod[data-type="+items[i]+"]");
		for (var j=0;j<tarArray.length;j++){
			//data有type属性？？？
			for(var p in $(tarArray[j]).data()){
				if(!(p=="uiResizable" || p=="uiDraggable")){
					data+=p+':^'+$(tarArray[j]).data()[p]+","
				}
			}
			data+='||';
		}
	}
	
	$("#dataArea").append('<textarea name="posts">'+data+'</textarea>')
	$("#dataForm").submit();
}

Preview.prototype.move=function(){
	var self=this;
	$("#wrap").mousemove(function(e){
		clearTimeout(self.moveTime);
		self.moveTime=setTimeout(function(){
			var x=e.pageX-($(window).width()-$("#wrap").width())/2,
				y=e.pageY-parseFloat($("#preview").css("margin-top"));
			console.log("x:"+x+",y:"+y);
		},200);
	})
}

var pre=new Preview();
pre.init();
$(".add").click(function(){
	pre.add($(this));
	return false;
})

$("#submit").click(function(){
	pre.submit();
	return false;
})