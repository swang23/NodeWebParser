var express = require('express');
var superagent = require('superagent');
var qs = require("querystring");
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var app = express();

app.use(express.static('webapp'));

app.post('/getData', function (req, res) {
	req.on('data', function(data) {
		var currentData = ""+data;
		var tempData = qs.parse(currentData);
		var index = tempData.num;
		console.log(tempData.num);
		var urlArr = [];
		for( var i = index*10-9; i <= index*10; i++ ){
		 	var url = "http://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&PageIndex="+i+"&ParentCategoryId=0";
			urlArr.push(url);
		}
		var postData = [];
		var startTime = new Date().getTime();
		for( var j = 0; j < urlArr.length; j++ ){
			superagent.get(urlArr[j]).end(function(err,pre){
				var $ = cheerio.load(pre.text);
				for( var i = 0; i < $(".post_item_body").length; i++ ){
					var titleElement = $(".post_item_body>h3>a").eq(i);
					var title = titleElement.text();
					var sourceUrl = titleElement.attr("href");
					var textElement = $(".post_item_summary").eq(i);
					var text = textElement.text();
					if(!text.match("爬虫")){
						continue;
					}
					var Element = $(".post_item_summary").eq(i);
					var coverElement = Element.find('img');
					var cover = "";
					if( coverElement!=undefined&&coverElement!=null ){
						cover = "https:"+coverElement.attr("src");
					}
					var tempData = {
						itemTitle: title,
						itemLink: sourceUrl,
						itemText: text,
						itemCover: cover
					}
					postData.push(tempData);
				}
				ep.emit("dataEvent");
			})
		}
		ep.after('dataEvent',10,function(){
			res.header("Access-Control-Allow-Origin", "*");
			res.json({
				success: 1,
				ret: postData
			})
			var endTime = new Date().getTime();
			var time = endTime-startTime;
			console.log(time);
		});
	});
})

app.post('/getZhihuData', function (req, res) {
	req.on('data', function(data) {
		var currentData = ""+data;
		var tempData = qs.parse(currentData);
		var index = tempData.num;
		console.log(tempData.num);
		
		var postData = [];
		var startTime = new Date().getTime();
		
		var url = "https://mswiki.morningstar.com/display/DCT/DAP";
		superagent.get(url).end(function(err,pre){
			console.log(pre.text);
			var $ = cheerio.load(pre.text);
			console.log($(".Card TopstoryItem TopstoryItem--experimentExpand").length);
		})
		res.header("Access-Control-Allow-Origin", "*");
		res.json({
			success: 1,
			ret: postData
		})
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})