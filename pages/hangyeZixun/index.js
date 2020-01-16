const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		isAllEmptyFlag : false,
		serverUrl: app.globalData.serverUrl,
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		zxListData : []
	},
	onLoad : function(){
		this.loadZxList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadZxList();
		}
	},
	loadZxList : function(){
		var _this = this;
		var field = {msgTypeId:1,showStatus:0,readSta:-1,page:this.data.nowPage,limit:50};
		this.setData({
			loading : true
		}); 
		let { nowPage,zxListData } = this.data;
		util.showLoading('数据加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/MsgCenter/getMsgCenterPageList',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				//console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						zxListData.push( ...res.data.datas );
						_this.setData({ 
							zxListData,
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
	getNewsDet : function(e){
		var newsId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/hangyeZixun/zixunDet?newsId=' + newsId);
	}
})