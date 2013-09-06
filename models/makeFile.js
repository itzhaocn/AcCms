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

MakeFile.prototype.formatData=function(){
	var mods=[],result=this.posts.split("||");
	
	for (var i=0;i<result.length;i++){
		var items=result[i].split(",");
		mods[i]={};
		for (var j=0;j<items.length;j++){
			var p=items[j].split(":^");
			mods[i][p[0]]=p[1];
		}
	}
	
	var n=mods.length,html='',css='';
	for(var i=0;i<n;i++){
		switch (mods[i].type){
			case "link": 
				html+='		<a href="'+mods[i].url+'" class="mod_link" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
			break;
			case "hoverLink":
				html+='		<a href="'+mods[i].url+'" class="mod_link" id="mod'+i+'" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;" target="'+mods[i].target+'">'+mods[i].text+'</a>'+br;
				css+='#mod'+i+'{background:'+mods[i].img+';}'+br
					+'#mod'+i+':hover{background:'+mods[i].hoverImg+';}'+br;
			break;
			case "iframe":
				html+='		<iframe src="'+mods[i].src+'" style="width:'+mods[i].width+'px;height:'+mods[i].height+'px;left:'+mods[i].left+'px;top:'+mods[i].top+'px;background:'+mods[i].background+';" class="mod" name="iframe" frameborder="0" scrolling="'+mods[i].scrolling+'" allowtransparency="'+mods[i].allowtransparency+'"></iframe>'+br;
			break;
		
		}
	}
	this.htmlMod=html;
	this.cssMod=css;
}