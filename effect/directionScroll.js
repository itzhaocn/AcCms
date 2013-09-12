//滚动
function directionScroll(target,direction,delay,speed,scrollNum){
	var ele=$("#"+target),
		list=ele.find("ul"),
		html=list.html(),
		t,
		num=scrollNum;

	list.append(html);
	setTimeout(function(){
		move();
	},delay);
	
	ele.mouseover(function(){
		clearTimeout(t);
	});
	ele.mouseout(function(){
		num=scrollNum;
		t=setTimeout(function(){move()},delay);
	})

	function move(){
		var list=$("#"+target+" ul"),
			item=list.find("li").eq(0),
			itemLast=list.find("li").last();
		var distance,dir;
		if(direction=="left"){
			distance=item.width()+parseFloat(item.css("margin-left"))+parseFloat(item.css("margin-right"))+parseFloat(item.css("padding-left"))+parseFloat(item.css("padding-left"));
			list.animate({marginLeft:-distance+"px"},distance*speed,"linear",function(){
				list.append(item).css("marginLeft","0");
				moveCallback();
			})
		}else if(direction=="right"){
			distance=itemLast.width()+parseFloat(item.css("margin-left"))+parseFloat(item.css("margin-right"))+parseFloat(item.css("padding-left"))+parseFloat(item.css("padding-left"));
			list.prepend(itemLast);
			list.css("margin-left",-distance+"px");
			list.animate({marginLeft:"0"},distance*speed,"linear",function(){
				moveCallback();
			})
		}else if(direction=="top"){
			distance=item.height()+parseFloat(item.css("margin-top"))+parseFloat(item.css("margin-bottom"))+parseFloat(item.css("padding-top"))+parseFloat(item.css("padding-top"));
			list.animate({marginTop:-distance+"px"},distance*speed,"linear",function(){
				$("#"+target+" ul").append(item).css("marginTop","0");
				moveCallback();
			})
		}else if(direction=="bottom"){
			distance=itemLast.height()+parseFloat(item.css("margin-top"))+parseFloat(item.css("margin-bottom"))+parseFloat(item.css("padding-top"))+parseFloat(item.css("padding-top"));
			list.prepend(itemLast);
			list.css("margin-top",-distance+"px");
			list.animate({marginTop:"0"},distance*speed,"linear",function(){
				moveCallback();
			})
		}
	}

	function moveCallback(){
		if(num>1){
			t=setTimeout(function(){move()},0);
		}else{
			t=setTimeout(function(){
				num=scrollNum;
				move();
			},delay);
		}
		num--;
	}
}

module.exports = directionScroll;