var express = require('express');
var superagent = require('superagent');
var qs = require("querystring");
var http = require('http');
var request = require('request');
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
		for( var i = index*2-1; i <= index*2; i++ ){
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
					// if(!text.match("爬虫")){
					// 	continue;
					// }
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
		ep.after('dataEvent',2,function(){
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
		var afterId = index*10-1;
		var url = "https://www.zhihu.com/api/v3/feed/topstory?action_feed=True&limit=10&session_token=a28a2fdc4537d7d14cbd46bcaf16912a&action=down&after_id="+afterId+"&desktop=true";
		superagent.get(url)
		.set({
			'Cookie': '_zap=67cf877b-b4c4-4798-9e23-d3ef6553d2f9; q_c1=fae7f35742874cd2b0356a5c321d085f|1501321325000|1501321325000; aliyungf_tc=AQAAAPsawBFU6QgABtBbcXShs11WbLol; q_c1=fae7f35742874cd2b0356a5c321d085f|1512744706000|1501321325000; _xsrf=51039ae2b79b7ba81f1da8eba41f2b62; r_cap_id="MDc0MTM0MWZlNWY2NDc2Mzk1YTdhOWE0MWFkZDQzYjA=|1512744706|b5b2a49f82637c6408347fe8941ea3315f5f5be3"; cap_id="NjI5ZDM3YTIzY2ZjNDhhOWJlZWM2MjIxNjQ0MjNmOTE=|1512744706|210d6f4e2c44900b25afebff79b79d9aac13dda0"; d_c0="ABBCbcS6zQyPTk28d91f51hdLtLQ1xQPe3s=|1512744707"; l_n_c=1; z_c0=Mi4xRDVobkFRQUFBQUFBRUVKdHhMck5EQmNBQUFCaEFsVk5JUFVYV3dBaC1ZVktoUjFoRExNMEI1Mkp5a1BWSHpUaERn|1512744736|1d19657b025b92339fecc550c2fc8606f0f5ba48; __utma=155987696.856620421.1512833230.1512833230.1512833230.1; __utmc=155987696; __utmz=155987696.1512833230.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=51039ae2b79b7ba81f1da8eba41f2b62',
			'Host': 'www.zhihu.com',
			'Referer': 'https://www.zhihu.com/',
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
			'x-api-version': '3.0.53',
			'x-udid': 'ABBCbcS6zQyPTk28d91f51hdLtLQ1xQPe3s=',
			'Connection': 'keep-alive',
			'authorization': 'Bearer Mi4xRDVobkFRQUFBQUFBRUVKdHhMck5EQmNBQUFCaEFsVk5JUFVYV3dBaC1ZVktoUjFoRExNMEI1Mkp5a1BWSHpUaERn|1512744736|1d19657b025b92339fecc550c2fc8606f0f5ba48'
		})
		.end(function(err,obj){
			if(err){
				var X = JSON.parse(err);
				var Y = JSON.stringify(X);
				console.log(Y);
				console.log("err");
				return;
			}
			var tempData = {
				value: obj.text,
			};
			res.json({
				success: 1,
				ret: tempData
			})
		})
		
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})