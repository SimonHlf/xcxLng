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
		navTab : ['可租可卖','租储罐','卖储罐'],
		currentTab : 0,
		sxInfo : '',
		potPpId : '',
		zzjzTypeId : '',
		potVol : -1
	},
	onLoad : function(){
		this.loadPotTradeList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadPotTradeList();
		}
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({ 
			currentTab : index,
			nowPage :1,
			loading : false,
			potTradeData : [],
			sxInfo : '',
			potPpId : '',
			zzjzTypeId : '',
			potVol : -1
		});
		wx.pageScrollTo({
		  scrollTop: 0
		})
		this.loadPotTradeList();
	},
	onShow(){
		if(this.data.sxInfo != '' || this.data.potPpId != '' || this.data.zzjzTypeId != '' || this.data.isAllEmptyFlag){//从最新发布页面返回过来并且已经发布
			this.setData({
				nowPage :1,
				loading : false,
				potTradeData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadPotTradeList(); 
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	goPotTradeDet : function(e){
		let ptId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/potTradeSellerDet/index?ptId=' + ptId);
	},
	goFilter : function(){
		util.navigateTo('/pages/potTrade/filter?sxInfo=' + this.data.sxInfo + '&potPpId=' + this.data.potPpId + '&zzjzTypeId=' + this.data.zzjzTypeId);
	},
	loadPotTradeList : function(){
		var _this = this;
		var field = {tradeStatus:this.data.currentTab,potPpId:this.data.potPpId,potVol:this.data.potVol,sxInfo:this.data.sxInfo,zzjzTypeId:this.data.zzjzTypeId,page:this.data.nowPage,limit:50,checkSta:1,showSta:0};
		console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,potTradeData } = this.data;
		util.showLoading('数据加载中...')
		wx.request({ 
			url : app.globalData.serverUrl + '/potTrade/queryPotTrade',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				console.log(res)
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
	pubPotTrade : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/pubPotTrade/index?currPageType=addPub');
		}
	}
})