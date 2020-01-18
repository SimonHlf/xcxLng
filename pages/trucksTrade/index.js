const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		potTradeData : [],
		nowPage : 1,
		serverUrl: app.globalData.serverUrl,
		isHasDataFlag : true,
		loading : false,
		isCanPubFlag : false,
		isAllEmptyFlag : false, 
		navTab : [{
			id:1,
			name:'租车'
		},{
			id:2,
			name:'卖车'
		}],
		currentTab : 0,
		currentTradeType : 1,
		spYear : '',
		potPpId : '',
		headPpId : ''
	},
	onLoad : function(){
		this.loadTruksTradeList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadTruksTradeList();
		}
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index,
			id = e.currentTarget.dataset.id;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({ 
			currentTab : index,
			currentTradeType : id,
			nowPage :1,
			loading : false,
			potTradeData : [],
			spYear : '',
			potPpId : '',
			headPpId : ''
		});
		wx.pageScrollTo({
		  scrollTop: 0
		})
		this.loadTruksTradeList();
	},
	onShow(){
		if(this.data.spYear != '' || this.data.potPpId != '' || this.data.headPpId != '' || this.data.isAllEmptyFlag){//从最新发布页面返回过来并且已经发布
			this.setData({
				nowPage :1,
				loading : false,
				potTradeData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadTruksTradeList(); 
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	getTrucksDet : function(e){
		let ttId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/trucksSellDet/index?ttId=' + ttId);
	},
	goFilter : function(){
		util.navigateTo('/pages/trucksTrade/filter?spYear=' + this.data.spYear + '&potPpId=' + this.data.potPpId + '&headPpId=' + this.data.headPpId);
	},
	loadTruksTradeList : function(){
		var _this = this;
		var field = {tradeType:this.data.currentTradeType,potPpId:this.data.potPpId,spYear:this.data.spYear,headPpId:this.data.headPpId,page:this.data.nowPage,limit:50,checkSta:1,showSta:0};
		console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,potTradeData } = this.data;
		util.showLoading('数据加载中...')
		wx.request({ 
			url : app.globalData.serverUrl + '/trucksTrade/queryTrucksTrade',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				//console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						potTradeData.push( ...res.data.datas );
						_this.setData({ 
							potTradeData,
							nowPage,
							loading : false,
							isHasDataFlag : true
						});
					}else{
						_this.setData({
							loading : false
						}); 
					} 
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					_this.setData({
						isHasDataFlag : false,
						loading : false
					});
				}
			}
		});
	},
	pubTrucksTrade : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/pubTrucksTrade/index?currPageType=addPub');
		}
	}
})