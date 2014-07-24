var fs=require('fs'),
	path = require('path'),
	rmdirSync = require('../models/rmdirSync.js');

//js效果文件
var qqWeibo=require('../effect/qqWeibo.js'),
	directionScroll=require('../effect/directionScroll.js'),
	msgBox=require('../effect/msgBox.js');

function MakeFile(id,web,bg,width,height,bgColor,posts){
	this.id=id;
	this.web=web;
	this.bg=bg;
	this.width=width;
	this.height=height;
	this.bgColor=bgColor;
	this.posts=posts;
	this.path=path.resolve('public','html',id);
}
module.exports = MakeFile;
var br='\n';

MakeFile.prototype.make=function(callback){
	if(!path.existsSync(this.path+'/img')){//不存在就创建一个
		fs.mkdirSync(this.path, 0755);
		fs.mkdirSync(this.path+'/css', 0755);
		fs.mkdirSync(this.path+'/img', 0755);
		fs.mkdirSync(this.path+'/js', 0755);
	}else{
		rmdirSync(this.path+'/css');
		rmdirSync(this.path+'/js');
		rmdirSync(this.path+'/index.html');
		fs.mkdirSync(this.path+'/css', 0755);
		fs.mkdirSync(this.path+'/js', 0755);
	}
	
	this.formatData();
	this.makeSpaceImg();
	this.makeCss();
	this.makeJs();
	this.makeHtml();
	callback();
}

MakeFile.prototype.makeCss=function(){

	var content='@charset "utf-8";'+br
				+'html,body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,a,em,img,strike,strong,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline;}'+br
				+'ul,ol{list-style:none;}'+br
				+'body{color:#333333;line-height:24px;font-size:12px;background:'+this.bgColor+';}'+br
				+'a{color:#333333;text-decoration:none;}'+br
				+'a:hover{text-decoration:underline;}'+br
				+'*html .group{height:1%;}'+br
				+'*:first-child+html .group{min-height:1px;}'+br
				+'.group:after{content:".";display:block;height:0;clear:both;visibility:hidden;font-size:0;}'+br
				+'.bg_box{min-width:'+this.width+'px;height:'+this.height+'px;}'+br
				+'.bg_box div{width:100%;}'+br
				+'.bg_box i{display:block;height:1px;font-size:0;line-height:0;width:'+this.width+'px;margin:0 auto;}'+br
				+'.wrap_box{position:absolute;left:0;top:0;width:100%;}'+br
				+'.wrap{width:'+this.width+'px;margin:0 auto;position:relative;}'+br
				+'.mod,.mod_link{position:absolute;display:block;overflow:hidden;}'+br
				+'.mod_link{text-indent:-999px;background:url(../img/space.png) no-repeat -999px 0;}'+br
				+'.shade{display:none;background:#000000;opacity:0.3;filter:alpha(opacity=30);position:fixed;_position:absolute;width:100%;height:100%;z-index:10;left:0;top:0;}'+br
				+'.win{display:none;position:fixed;_position:absolute;z-index:100;left:50%;top:50%;margin:-200px 0 0 -200px;_margin:0;width:400px;height:400px;background:#CCCCCC;}'+br
				+'.win_close{position:absolute;right:4px;top:4px;width:9px;height:8px;background:red url(../img/win_close.png) no-repeat 0 0;cursor:pointer;}'+br;


	var bgs=this.bg.split("**"),
		n=bgs.length,
		j=1,
		self=this;
	//生成背景图
	(function makeBg(){
		var array=bgs[j-1].split("::");
		var imgData=array[2].split("base64,");
		fs.open(self.path+'/img/'+array[0], 'w', 0644,function(e,fd){
			if(e) throw e;
			fs.write(fd,imgData[1],0,'base64',function(e){
				if(e) throw e;
				fs.closeSync(fd);
			})
		})
		j++;
		if(j<=n){
			setTimeout(arguments.callee,10);
		}
	})();

	for (var i=1;i<n;i++ ){
		var array=bgs[i-1].split("::");
		content+='.bg'+i+'{background:url(../img/'+array[0]+') no-repeat center 0;height:'+array[1]+'px;}'+br;
	}
	
	content+=this.cssMod;

	fs.open(this.path+'/css/style.css', 'w', 0644,function(e,fd){
		if(e) throw e;
		fs.write(fd,content,0,'utf8',function(e){
			if(e) throw e;
			fs.closeSync(fd);
		})
	})
}

MakeFile.prototype.makeHtml=function(){

	var content='<!DOCTYPE HTML>'+br
			   +'<html> '+br
			   +'<head> '+br
			   +'<meta charset="utf-8"> '+br
			   +'<title>'+this.web+'</title> '+br
			   +'<link rel="stylesheet" type="text/css" href="css/style.css" />'+br
			   +'</head>'+br
			   +'<body>'+br
			   +'<div class="bg_box">'+br;
	var bgs=this.bg.split("**")
	for (var i=1;i<bgs.length;i++ ){
		content+='	<div class="bg'+i+'"><i></i></div>'+br;
	}
	content+='</div>'+br
			+'<div class="wrap_box">'+br
			+'	<div class="wrap" id="wrap">'+br
			+this.htmlMod+br
			+'	</div>'+br
			+'</div>'+br
			+this.bodyAppendHtml+br;
	if(this.jsMod!=""){
		content+='<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>'+br
				+'<script src="js/common.js"></script>'+br;
	}
	if(this.jsControl!=""){
		content+='<script>'+br+this.jsControl+br+'</script>'+br;
	}
	content+='</body>'+br
			+'</html>'+br;
	fs.open(this.path+'/index.html', 'w', 0644,function(e,fd){
		if(e) throw e;
		fs.write(fd,content,0,'utf8',function(e){
			if(e) throw e;
			fs.closeSync(fd);
		})
	})
}

MakeFile.prototype.makeJs=function(){
	if(this.jsMod!=""){
		var content=this.jsMod+br;
		fs.open(this.path+'/js/common.js', 'w', 0644,function(e,fd){
			if(e) throw e;
			fs.write(fd,content,0,'utf8',function(e){
				if(e) throw e;
				fs.closeSync(fd);
			})
		})	
	}
}

MakeFile.prototype.makeSpaceImg=function(){
	var content='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY0QTAzRTkyMUI2OTExRTM4MjMzRThBODczRDE1NTdBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY0QTAzRTkzMUI2OTExRTM4MjMzRThBODczRDE1NTdBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjRBMDNFOTAxQjY5MTFFMzgyMzNFOEE4NzNEMTU1N0EiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjRBMDNFOTExQjY5MTFFMzgyMzNFOEE4NzNEMTU1N0EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Xuqs+AAAABlBMVEX///8AAABVwtN+AAAADElEQVR42mJgAAgwAAACAAFPbVnhAAAAAElFTkSuQmCC';
	fs.open(this.path+'/img/space.png', 'w', 0644,function(e,fd){
		if(e) throw e;
		fs.write(fd,content,0,'base64',function(e){
			if(e) throw e;
			fs.closeSync(fd);
		})
	})	
}


MakeFile.prototype.formatData=function(){
	var mods=[],result=this.posts.split("||");
	
	for (var i=0;i<(result.length-1);i++){
		var items=result[i].split(",");
		mods[i]={};
		for (var j=0;j<(items.length-1);j++){
			var p=items[j].split(":^");
			mods[i][p[0]]=p[1];
		}
	}
	
	var n=mods.length,html='',css='',js='',jsControl='',bodyAppendHtml='';
	for(var i=0;i<n;i++){
		switch (mods[i].type){
			case "div":
				html+='		<div id="'+mods[i].mid+'" class="mod" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;"></div>'+br;
			break;
			case "link": 
				if(mods[i].background==""){
					html+='		<a href="'+mods[i].url+'" id="'+mods[i].mid+'" class="mod_link" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
				}else{
					html+='		<a href="'+mods[i].url+'" id="'+mods[i].mid+'" class="mod_link" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;background:'+mods[i].background+';" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
				}
			break;
			case "imgLink": 
				html+='		<a href="'+mods[i].url+'" id="'+mods[i].mid+'" class="mod" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'"><img src="'+mods[i].img+'" alt="'+mods[i].text+'" /></a>'+br;
			break;
			case "hoverLink":
				if(mods[i].mid!=""){
					var hoverId=mods[i].mid;
				}else{
					var hoverId='mod'+i;
				}
				html+='		<a href="'+mods[i].url+'" class="mod_link" id="'+hoverId+'" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
				css+='#'+hoverId+'{background:'+mods[i].background+';}'+br
					+'#'+hoverId+':hover{background:'+mods[i].hoverBackground+';}'+br;
			break;
			case "iframe":
				html+='		<iframe src="'+mods[i].src+'" id="'+mods[i].mid+'" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;background:'+mods[i].background+';" class="mod" name="iframe" frameborder="0" scrolling="'+mods[i].scrolling+'" allowtransparency="'+mods[i].allowtransparency+'"></iframe>'+br;
			break;
			case "flash":
				html+='<object width="'+mods[i].width+'" height="'+mods[i].height+'" id="'+mods[i].mid+'" class="mod" style="left:'+mods[i].left+'px;top:'+mods[i].top+'px;" data="'+mods[i].url+'" name="flash" type="application/x-shockwave-flash">'+br
					+'<param value="'+mods[i].url+'" name="movie">'+br
					+'<param value="always" name="allowScriptAccess">'+br
					+'<param value="internal" name="allowNetworking">'+br
					+'<param value="high" name="quality">'+br 
					+'<param value="opaque" name="wmode">'+br
					+'</object>'+br;
			break;
			case "textarea":
				html+='		<textarea class="mod" id="'+mods[i].mid+'" style="border:'+mods[i].border+';width:'+mods[i].width+'px;height:'+mods[i].height+'px;padding:'+mods[i].padding+';left:'+mods[i].left+'px;top:'+mods[i].top+'px;background:'+mods[i].background+';color:'+mods[i].color+';">'+mods[i].text+'</textarea>'+br;
			break;
			case "qqWeiboControl":
				if(js.indexOf("qqWeibo")<0){
					js+=qqWeibo+br+br;
				}
				jsControl+='qqWeibo("'+mods[i].btnId+'","'+mods[i].textareaId+'");'+br;
			break;
			case "scrollControl":
				if(js.indexOf("directionScroll")<0){
					js+=directionScroll+br+br;
				}
				jsControl+='directionScroll("'+mods[i].targetId+'","'+mods[i].direction+'",'+mods[i].delay+','+mods[i].speed+','+mods[i].scrollNum+');'+br;
			break;
			case "winControl":
				if(js.indexOf("msgBox")<0){
					bodyAppendHtml+='<div class="shade" id="shade"></div>'+br;
					js+=msgBox+br+br;
				}
				bodyAppendHtml+='<input type="button" name="" id="'+mods[i].btnId+'" value="'+mods[i].btnName+'" />'+br
					+'<div id="'+mods[i].mid+'" class="win '+mods[i].className+'">'+br
					+'	<div class="win_close"></div>'+br
					+'</div>'+br;
				jsControl+='$("#'+mods[i].btnId+'").click(function(){'+br
						+'	$("#'+mods[i].mid+',#shade").show();'+br
						+'	msgBox("'+mods[i].mid+'","'+mods[i].returnTop+'");'+br
						+'	return false;'+br
						+'});'+br;
			break;


		}
	}
	this.htmlMod=html;
	this.cssMod=css;
	this.jsMod=js;
	this.jsControl=jsControl;
	this.bodyAppendHtml=bodyAppendHtml;
}








