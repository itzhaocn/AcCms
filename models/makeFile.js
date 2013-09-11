//删除目录及文件
var fs=require('fs'),
	path = require('path'),
	rmdirSync = require('../models/rmdirSync.js');

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
	this.makeCss();
	this.makeHtml();
	this.makeJs();
	callback();
}

MakeFile.prototype.makeCss=function(){

	var content='@charset "utf-8";'+br
				+'html,body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,a,em,img,strike,strong,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline;}'+br
				+'ul,ol{list-style:none;}'+br
				+'body{color:#333333;line-height:24px;font-size:12px;background:'+this.bgColor+'}'+br
				+'a{color:#333333;text-decoration:none;}'+br
				+'a:hover{text-decoration:underline;}'+br
				+'*html .group{height:1%;}'+br
				+'*:first-child+html .group{min-height:1px;}'+br
				+'.group:after{content:".";display:block;height:0;clear:both;visibility:hidden;font-size:0;}'+br
				+'.bg_box{min-width:'+this.width+'px;}'+br
				+'.bg_box i{display:block;height:1px;font-size:0;line-height:0;width:'+this.width+'px;margin:0 auto;}'+br
				+'.wrap_box{position:absolute;left:0;top:0;width:100%;}'+br
				+'.wrap{width:'+this.width+'px;margin:0 auto;position:relative;}'+br
				+'.mod,.mod_link{position:absolute;display:block;}'+br
				+'.mod_link{text-indent:-999px;overflow:hidden;}'+br;

	var bgs=this.bg.split(",");
	for (var i=0;i<(bgs.length-1);i++ ){
		var array=bgs[i].split(":");
		content+='.bg'+i+'{width:100%;background:url(../img/'+array[0]+') no-repeat center 0;height:'+array[1]+'px;}'+br;
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
	var bgs=this.bg.split(",")
	for (var i=0;i<(bgs.length-1);i++ ){
		content+='	<div class="bg'+i+'"><i></i></div>'+br;
	}
	content+='</div>'+br
			+'<div class="wrap_box">'+br
			+'	<div class="wrap" id="wrap">'+br
			+this.htmlMod+br
			+'	</div>'+br
			+'</div>'+br
			+'<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>'+br
			+'<script src="js/common.js"></script>'+br
			+'<script>'+br+this.jsControl+br+'</script>'+br
			+'</body>'+br
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
	var content=this.jsMod+br;
	fs.open(this.path+'/js/common.js', 'w', 0644,function(e,fd){
		if(e) throw e;
		fs.write(fd,content,0,'utf8',function(e){
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
	
	var n=mods.length,html='',css='',js='',jsControl='';
	for(var i=0;i<n;i++){
		switch (mods[i].type){
			case "div":
				html+='		<div id="'+mods[i].mid+'" class="mod" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;"></div>'+br;
			break;
			case "link": 
				html+='		<a href="'+mods[i].url+'" id="'+mods[i].mid+'" class="mod_link" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
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
					js+='function qqWeibo(btnId,textareaId){'+br
						+'	$("#"+btnId).click(function(){'+br
						+'		var _t = encodeURIComponent($("#"+textareaId).val());'+br
						+'		var _url = encodeURI(document.location);'+br
						+'		var _appkey = encodeURI("appkey");'+br
						+'		var _pic = encodeURI("");'+br
						+'		var _site = "";'+br
						+'		var _u = "http://v.t.qq.com/share/share.php?title="+_t+"&url="+_url+"&appkey="+_appkey+"&site="+_site+"&pic="+_pic'+br
						+'		window.open( _u,"转播到腾讯微博", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no" );'+br
						+'		return false;'+br
						+'	})'+br
						+'}'+br;
				}
				jsControl+='qqWeibo("'+mods[i].btnId+'","'+mods[i].textareaId+'");'+br;
			break;
		}
	}
	this.htmlMod=html;
	this.cssMod=css;
	this.jsMod=js;
	this.jsControl=jsControl;
}




