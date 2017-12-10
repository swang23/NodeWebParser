var vm = new Vue({
	el: "#main",
	data: {
		items:[],
		pageOne: true,
		pageTwo: false,
		imgWidth: "",
		pageNum: 1,//一共有三页，对应页面头部三种分类
		num: 1,//第一页下面数据的页数
		zNum: 1,//第二页内数据的页数
		working: false,
		scroll1:0,
		scroll2:0,
		scroll3:0,
		imgs: [],
	},
	methods: {
		ifBottom: function(){
			var $this = this;
			var scrollHeight=document.documentElement.scrollTop||document.body.scrollTop;
    		var pageHeight=document.documentElement.clientHeight||document.body.clientHeight;
    		var dis = 0;
    		if( $(".item")[$(".item").length-1]==undefined&&$(".imgBlock")[$(".imgBlock").length-1]==undefined ){
    			return 1;
    		}
    		if( $this.pageNum==1 ){
    			dis = $(".item")[$(".item").length-1].offsetTop;
    		}else if( $this.pageNum==2 ){
    			dis = $(".imgBlock")[$(".imgBlock").length-1].offsetTop+$(".imgBlock").eq(0).height();
    		}
			if( (scrollHeight+pageHeight)>dis ){
				return 1;
			}
		},
		changePage: function($index){
			var $this = this;
			$this.setScroll($index);	
			switch($index){
				case 1:
					$this.pageOne = true;
					$this.pageTwo = false;
					$this.pageNum = $index;
					setTimeout(function(){
						document.body.scrollTop = $this.scroll1;
					},0);
					break;
				case 2:
					$this.pageOne = false;
					$this.pageTwo = true;
					$this.pageNum = $index;
					if( $this.zNum==1 ){
						$this.load();
					}
					setTimeout(function(){
						document.body.scrollTop = $this.scroll2;
					},0);
					break;
				case 3:
					break;
			}
		},
		setScroll: function($index){
			var $this = this;
			if($index!=$this.pageNum){
				switch($this.pageNum){
					case 1:
						$this.scroll1 = document.body.scrollTop;
						break;
					case 2:
						$this.scroll2 = document.body.scrollTop;
						break;
				}
			}
		},
		load: function(){
			var $this = this;
			if($this.working){
				return;
			}
			$this.working = true;
			switch($this.pageNum){
				case 1:
					$.ajax({
						url: 'http://192.168.0.106:8081/getData',
						type: 'POST',
						data: {
							num: $this.num,
						},
						success: function(data){
							var tempData = data.ret;
							for( var i = 0; i < tempData.length; i++ ){
								var tempItem = {
									img: tempData[i].itemCover,
									text: tempData[i].itemText,
									num: "139",
									title: tempData[i].itemTitle,
									url: tempData[i].itemLink
								}
								$this.items.push(tempItem);
							}
							$this.num++;
							$this.working = false;
							localStorage.items=JSON.stringify($this.items);
							localStorage.num=$this.num;
						}
					})
					break;
				case 2:
					$.ajax({
						url: 'http://192.168.0.106:8081/getZhihuData',
						type: 'POST',
						data: {
							num: $this.zNum,
						},
						success: function(data){
							var strData = data.ret.value;
							var objData = JSON.parse(strData);
							var tempData = objData.data;
							for( var i = 0; i < tempData.length; i++ ){
								if(tempData[i].target==null||tempData[i].target==undefined||tempData[i].target.question==undefined){
									continue;
								}
								var itemText = tempData[i].target.excerpt;
								var itemAnswerId = tempData[i].target.id;
								var itemQuestionId = tempData[i].target.question.id;
								var itemUrl = "https://www.zhihu.com/question/"+itemQuestionId+"/answer/"+itemAnswerId;
								var title = tempData[i].target.question.title;
								var tempItem = {
									text: itemText,
									url: itemUrl,
									title: title,
								}
								$this.imgs.push(tempItem);
							}
							$this.zNum++;
							$this.working = false;
							//localStorage.items=JSON.stringify($this.items);
							//localStorage.num=$this.num;
						}
					})
					break;
				case 3:
					break;
			}
			
		}
	},
	ready: function(){
		var $this = this;
		var width = document.body.clientWidth;
		$this.imgWidth = (width-45)/2+"px";
		if(localStorage.num!=undefined&&localStorage.num!=null){
			$this.items = JSON.parse(localStorage.items);
			$this.num = localStorage.num;
			window.onscroll=function(){
		       if( $this.ifBottom() ){
		           $this.load();
		       }
	    	}
			return;
		}
		$this.load();
		window.onscroll=function(){
	        if( $this.ifBottom() ){
	            $this.load();
	        }
    	}
    }
})