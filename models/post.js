var mongodb = require('./db');

function Post(web,bg,width,height,bgColor,posts) {
  this.web= web;
  this.bg= bg;
  this.width= width;
  this.height= height;
  this.bgColor= bgColor;
  this.posts = posts;
}

module.exports = Post;

Post.prototype.save = function(callback) {//存储一篇文章及其相关信息
  var date = new Date();

	var date=new Date(),
		year=String(date.getFullYear()),
		month=(date.getMonth()+1)<10?"0"+String(date.getMonth()+1): String(date.getMonth()+1),
		dates=date.getDate()<10?"0"+String(date.getDate()): String(date.getDate()),
		hours=date.getHours()<10?"0"+String(date.getHours()): String(date.getHours()),
		minutes=date.getMinutes()<10?"0"+String(date.getMinutes()): String(date.getMinutes()),
		seconds=date.getSeconds()<10?"0"+String(date.getSeconds()): String(date.getSeconds());
	var time=year + month + dates + hours + minutes + seconds;
  //要存入数据库的文档
  var post = {
      time: time,
      bg:this.bg,
      web:this.web,
      width:this.width,
      height:this.height,
      bgColor:this.bgColor,
      posts: this.posts
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('list', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function (err,post) {
        mongodb.close();
        callback(null);
      });
    });
  });
};

Post.prototype.update = function(webId,callback) {//存储一篇文章及其相关信息
	var bg=this.bg,
		web=this.web,
		width=this.width,
		height=this.height,
		bgColor=this.bgColor,
		posts=this.posts;
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

	db.collection('list', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
	  console.log(this.width);
	//update数据

      collection.update(
		  {time:webId},
		  {$set:{"bg":bg,"web":web,"width":width,"height":height,"bgColor":bgColor,"posts":posts}},
		  {safe: true}, function (err,post) {
			mongodb.close();
			callback(null);
      });
    });
  });
};

Post.get = function(time, callback) {//读取文章及其相关信息
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('list', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
	  if (time) {
          query.time = time;
		  //根据 query 对象查询文章
		  collection.find(query).sort({
			time: -1
		  }).toArray(function (err, docs) {
			mongodb.close();
			if (err) {
			  callback(err, null);//失败！返回 null
			}
			callback(null, docs);//成功！以数组形式返回查询的结果
		  });
	  }else{
		  //根据 query 对象查询文章
		  collection.find({},{time:1,web:1}).sort({
			time: -1
		  }).toArray(function (err, docs) {
			mongodb.close();
			if (err) {
			  callback(err, null);//失败！返回 null
			}
			callback(null, docs);//成功！以数组形式返回查询的结果
		  });
	  }

    });
  });
};


Post.prototype.del = function(id, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('list', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			if (id) {
				db.collection('list', function (err, collection) {
					if (err) {
						mongodb.close();
						return callback(err);
					}
					//根据 query 对象删除文章
					collection.remove({
						time: id
					}, function (err,post) {
						mongodb.close();
						callback(null);
					});
				});
			}
		});
	});
};