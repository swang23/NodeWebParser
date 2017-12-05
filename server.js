var express = require('express');
var superagent = require('superagent');
var qs = require("querystring");
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();

app.use(express.static('webapp'));

app.post('/getData', function (req, res) {
	req.on('data', function(data) {
		var currentData = ""+data;
		var tempData = qs.parse(currentData);
		console.log(tempData.num);
		var url = "http://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&PageIndex="+tempData.num+"&ParentCategoryId=0";
		// if(tempData.num!=1){
		// 	url = "https://www.cnblogs.com/#p"+tempData.num;
		// }

		console.log(url);
		
		// http.get(url,function(pre){
		// 	var html = "";
		// 	pre.setEncoding('utf-8');
		// 	pre.on('data',function(chunk){
		// 		html += chunk;
		// 	});
		// 	pre.on('end',function(){
		// 		var $ = cheerio.load(html);
		// 		var postData = [];
		// 		console.log($(".post_item_body").length);
		// 		for( var i = 0; i < $(".post_item_body").length; i++ ){
		// 			var titleElement = $(".post_item_body>h3>a").eq(i);
		// 			var title = titleElement.text();
		// 			console.log(title);
		// 			var sourceUrl = titleElement.attr("href");
		// 			var textElement = $(".post_item_summary").eq(i);
		// 			var text = textElement.text();
		// 			var Element = $(".post_item_summary").eq(i);
		// 			var coverElement = Element.find('img');
		// 			var cover = "";
		// 			if( coverElement!=undefined&&coverElement!=null ){
		// 				cover = "https:"+coverElement.attr("src");
		// 			}
		// 			var tempData = {
		// 				itemTitle: title,
		// 				itemLink: sourceUrl,
		// 				itemText: text,
		// 				itemCover: cover
		// 			}
		// 			postData.push(tempData);
		// 		}
		// 		res.header("Access-Control-Allow-Origin", "*");
		// 		res.json({
		// 			success: 1,
		// 			ret: postData
		// 		})
		// 	})
		// })
		superagent.get(url).end(function(err,pre){
			var $ = cheerio.load(pre.text);
			var postData = [];
			console.log($(".post_item_body").length);
				for( var i = 0; i < $(".post_item_body").length; i++ ){
					var titleElement = $(".post_item_body>h3>a").eq(i);
					var title = titleElement.text();
					console.log(title);
					var sourceUrl = titleElement.attr("href");
					var textElement = $(".post_item_summary").eq(i);
					var text = textElement.text();
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
				res.header("Access-Control-Allow-Origin", "*");
				res.json({
					success: 1,
					ret: postData
				})
		})
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})