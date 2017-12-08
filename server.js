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
		
		var url = "https://www.zhihu.com/api/v3/feed/topstory?action_feed=True&limit=10&session_token=a28a2fdc4537d7d10e446309d459bb31&action=down&after_id=9&desktop=true";
		superagent.get(url)
		.set('accept','application/json, text/plain, */*')
		.set('Accept-Encoding','gzip, deflate, br')
		.set('Accept-Language','en-US,en;q=0.9')
		.set('authorization','Bearer Mi4xRDVobkFRQUFBQUFBa0lMalRVOWhEQmNBQUFCaEFsVk5qMVA1V2dBSXY4U1ZvMzhVNFdaUFM3WkVTTkVYR0NINTNR|1510737295|c74acfa890f1c9295af990abe42ad52f5f558851')
		.set('Cookie','_zap=ed3dc757-b978-4d8b-8eed-7ff53907f212; d_c0="AJCC401PYQyPThjQjbFM8q118PkrbVl0l6M=|1505468779"; q_c1=2e5a8b1ebf8844a98fab8869177bd97e|1508120028000|1505468587000; r_cap_id="MTE4OTVjZDMxYjRkNGRiN2I1ZjBlYmYyYWNiNzQ1ZTI=|1510737264|820018266297ca583d0ff74dee686230bc5dccf7"; cap_id="MjY1MDk5MmYyM2RmNDdiNDk5ZDQ5OTExYThlYmQzYzI=|1510737264|12b2ac29bbbbbc072bcfc0014bb18e745675aa3e"; z_c0=Mi4xRDVobkFRQUFBQUFBa0lMalRVOWhEQmNBQUFCaEFsVk5qMVA1V2dBSXY4U1ZvMzhVNFdaUFM3WkVTTkVYR0NINTNR|1510737295|c74acfa890f1c9295af990abe42ad52f5f558851; q_c1=24b5d3a989ce4a0598126413b7a55bb7|1510821597000|1505468587000; __utma=51854390.686839608.1511763929.1511763929.1511763929.1; __utmz=51854390.1511763929.1.1.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/question/68475996; __utmv=51854390.100-1|2=registration_date=20150426=1^3=entry_date=20150426=1; aliyungf_tc=AQAAAN2b7jJQEQ4AHZI+t51fIPAvVDr4; _xsrf=c07a4fb1-9293-405f-973b-491faf5cf923')
		.set('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36')
		.set('X-API-VERSION','3.0.53')
		.set('X-UDID','AJCC401PYQyPThjQjbFM8q118PkrbVl0l6M=')
		.end(function(err,pre){
			console.log(JSON.stringify(pre));
			//var $ = cheerio.load(pre.text);
			//console.log($(".TopstoryItem--experimentExpand").length);
			//$(".TopstoryItem--experimentExpand").each(function(){
			//	var tempData = {
			//		value: $(this).text()
			//	};
			//	postData.push(tempData);
			//	console.log($(this).text());
			//});
			//res.header("Access-Control-Allow-Origin", "*");
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