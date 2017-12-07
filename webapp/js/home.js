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
		imgs: [
			{
				message: "nihao",
				imgPath: "../img/01(1).jpg",
			},{
				message: "nihao",
				imgPath: "../img/01(1).jpg",
			},{
				message: "nihao",
				imgPath: "../img/01(1).jpg",
			},{
				message: "nihao",
				imgPath: "../img/01(1).jpg",
			},
		],
	},
	methods: {
		ifBottom: function(){
			var $this = this;
			var scrollHeight=document.documentElement.scrollTop||document.body.scrollTop;
    		var pageHeight=document.documentElement.clientHeight||document.body.clientHeight;
    		var dis = 0;
    		if( $(".item")[$(".item").length-1]==undefined||$(".imgBlock")[$(".imgBlock").length-1]==undefined ){
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
						document.documentElement.scrollTop = $this.scroll1;
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
						document.documentElement.scrollTop = $this.scroll2;
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
						$this.scroll1 = document.documentElement.scrollTop;
						break;
					case 2:
						$this.scroll2 = document.documentElement.scrollTop;
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
			alert($this.pageNum);
			switch($this.pageNum){
				case 1:
					$.ajax({
						url: 'http://10.86.16.51:8081/getData',
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
							//localStorage.items=JSON.stringify($this.items);
							//localStorage.num=$this.num;
						}
					})
					break;
				case 2:
					$.ajax({
						url: 'http://10.86.16.51:8081/getZhihuData',
						type: 'POST',
						data: {
							num: $this.zNum,
						},
						success: function(data){
							alert(JSON.stringify(data));
							var tempData = data.ret;
							//for( var i = 0; i < tempData.length; i++ ){
							//	var tempItem = {
							//		img: tempData[i].itemCover,
							//		text: tempData[i].itemText,
							//		num: "139",
							//		title: tempData[i].itemTitle,
							//		url: tempData[i].itemLink
							//	}
							//	$this.items.push(tempItem);
							//}
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
		//if(localStorage.num!=undefined&&localStorage.num!=null){
		//	$this.items = JSON.parse(localStorage.items);
		//	$this.num = localStorage.num;
		//	window.onscroll=function(){
		//        if( $this.ifBottom() ){
		//            $this.load();
		//        }
	    //	}
		//	return;
		//}
		$this.load();
		window.onscroll=function(){
	        if( $this.ifBottom() ){
				alert("load");
	            $this.load();
	        }
    	}
    }
})