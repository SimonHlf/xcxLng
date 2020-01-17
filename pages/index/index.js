const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		wholeIndexData : [],
		isShowFlag : false,
		serverUrl : app.globalData.serverUrl,
		days : 3
	},
	onLoad(){
		this.loadIndexData()
	},
	onShow(){
		if(this.data.isShowFlag){
			this.loadIndexData();
		}
	},
	onHide : function(){
		this.setData({
			isShowFlag : true
		});
	},
	loadIndexData(){
		let _this = this;
		util.showLoading('数据加载中...')
		wx.request({
			url : app.globalData.serverUrl + '/common/getWelcomeData',
			method : 'get',
			data : {days : _this.data.days},
			success: function(res){ 
				console.log(res)
				util.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						wholeIndexData : res.data.datas[0]
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无数据');
				}
			}
		});
	},
	getNewsDet : function(e){
		var newsId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/hangyeZixun/zixunDet?newsId=' + newsId);
	},
	getRqMyDet : function(e){
		let tradeId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/rqMySellerDet/index?tradeId=' + tradeId);
	},
	goZpList : function(e){
		if(this.data.wholeIndexData.zpList.length > 0){
			var id = e.currentTarget.dataset.id;
			util.navigateTo('/pages/driverZpDet/index?id=' + id);
		}
	},
	goQzList : function(e){
		if(this.data.wholeIndexData.qzList.length > 0){
			var id = e.currentTarget.dataset.id;
			util.navigateTo('/pages/driverQzDet/index?id=' + id);
		}
	}
})