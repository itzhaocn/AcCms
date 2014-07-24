//id名字与预览时有冲突，名称用mid
var controlData={
	"div":["mid","width","height","left","top"],
	//链接
	"link":["mid","text","width","height","left","top","target","url","background"],
	"imgLink":["mid","img","text","width","height","left","top","target","url"],
	//hover效果链接，img需填写完整background
	"hoverLink":["mid","text","width","height","left","top","target","url","background","hoverBackground"],
	"iframe":["mid","width","height","left","top","src","scrolling","background","allowtransparency"],
	"flash":["mid","width","height","left","top","url"],
	//微博textarea
	"textarea":["mid","width","height","left","top","text","padding","background","color","border"],

	//腾讯微博功能,需先添加一个文本域和按钮，以ID控制
	"qqWeiboControl":["textareaId","btnId"],
	
	/*
	滚动模块,定位为div，
	滚动内容为ul列表,页面生成后手动添加,水平滚动li为内联元素display:inline;
	参数依次为DirectionScroll(target,direction,delay,speed,scrollNum)
	*/
	"scrollControl":["targetId","direction","delay","speed","scrollNum"],

	//弹窗returnTop[true|false]，mid为弹窗ID，生成静态页面后修改对应样式及其内部html
	"winControl":["mid","className","btnId","btnName","returnTop"]
}

var clipHeight=150;





