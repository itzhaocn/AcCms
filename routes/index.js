
/*
 * GET home page.
 */
var crypto = require('crypto'),
	Post = require('../models/post.js'),
	MakeFile = require('../models/makeFile.js'),
	path = require('path'),
	rmdirSync = require('../models/rmdirSync.js');

module.exports = function(app){
	app.get('/', function(req,res){
		res.render('index',{
		  title: '主页',
		  success: req.flash('success').toString(),
		  error: req.flash('error').toString()
		});
	});
	
	app.get('/list', function(req, res){
		Post.get(null, function(err, posts){
			if(err){
			  posts = [];
			} 
			res.render('list',{
			  title: '列表',
			  posts:posts,
			  success: req.flash('success').toString(),
			  error: req.flash('error').toString()
			});
		});
	});	
	
	app.post('/save', function(req, res){
		var web=req.body.web,
			bg=req.body.bg,
			width=req.body.width,
			height=req.body.height,
			bgColor=req.body.bgColor,
			posts=req.body.posts;
		var post = new Post(web,bg,width,height,bgColor,posts);
		post.save(function(err){
			if(err){
			  req.flash('error', err); 
			  return res.redirect('/');
			}

			req.flash('success', '发布成功!');
			res.redirect('/list');
		});
	});	
	app.get('/make', function(req, res){
		res.render('make',{
		  title: '生成成功',
		  success: req.flash('success').toString(),
		  error: req.flash('error').toString()
		});
	});	
	app.post('/make', function(req, res){
		var id=req.body.id;
		Post.get(id,function(err,results){
			var web= results[0].web,
				bg= results[0].bg,
				width= results[0].width,
				height= results[0].height,
				bgColor= results[0].bgColor,
				posts = results[0].posts;
			var makeFile=new MakeFile(id,web,bg,width,height,bgColor,posts);
			makeFile.make(function(){
				res.render('make',{
				  title: '生成成功',
				  id:id,
				  success: req.flash('success').toString(),
				  error: req.flash('error').toString()
				});
			})
		});
	});	
	app.get('/modify', function(req, res){
		var id=req.query.id;
		Post.get(id,function(err,results){
			res.render('modify',{
				title: '修改 '+results[0].web+' '+id,
				webId:id,
				web: results[0].web,
				bg: results[0].bg,
				width: results[0].width,
				height: results[0].height,
				bgColor: results[0].bgColor,
				posts : results[0].posts,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});	
	app.post('/modify', function(req, res){
		var webId=req.body.webId,
			web=req.body.web,
			bg=req.body.bg,
			width=req.body.width,
			height=req.body.height,
			bgColor=req.body.bgColor,
			posts=req.body.posts;
		var post = new Post(web,bg,width,height,bgColor,posts);
		post.update(webId,function(err){
			if(err){
			  req.flash('error', err); 
			  return res.redirect('/');
			}

			req.flash('success', '修改成功!');
			res.redirect('/list');
		});
	});	
	app.get('/del', function(req, res){
		var id=req.query.id,
			post = new Post();
		post.del(id,function(err){
			if(err){
			  req.flash('error', err); 
			  return res.redirect('/list');
			}
			//删除本地文件
			var localPath=path.resolve('public','html',id);
			rmdirSync(localPath);

			req.flash('success', '删除 '+id+' 成功!');
			res.redirect('/list');
		});
	});	
}

function itemPrototype(opt){
	var items=[];
	var i=0
	for(var p in opt){
		items[i]=p;
		i++;
	}
	return items;
}

