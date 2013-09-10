AcCms
=====

基于nodejs独立静态页生成系统

原理：通过可视化操作制作简单的静态页面并生成静态文件。

实现方式：nodejs+mongodb

客户端：只适用chrome浏览器，其它未调试

功能：信息发布（DOM拖动、大小修改、console实时查看鼠标坐标位置）、信息删除（删除对应数据库记录及本地文件）、列表页

运行地址：http://127.0.0.1:3000

选项配置：
public\javascripts\controlData.js中自定义页面元素，一条数据分别对应为选项名称和选项所需参数
models\makeFile.js中MakeFile.formatData配置controlData.js中选项对应生成的html和css

参数说明：
1、“网页标题”即为网页title
2、“上传背景”为网页背景，可同时选择多张，显示顺序按照打开的顺序
3、“网页宽”指页面实际内容区域宽度，不以背景为参照，居中显示，必填
4、“网页高”与实际生成页面无关，仅使添加元素时更清楚页面元素位置
5、“背景色”指body背景色
6、背景色后按钮为自定义选项
7、暂无图片上传功能，生成页面之后需手动复制图片到img文件夹，静态文件生成目录为public/html

11