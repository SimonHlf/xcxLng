const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		msgListData : []
	},
	onLoad : function(){
		this.loadMsgList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadMsgList();
		}
	},
	loadMsgList : function(){
		var _this = this;
		var field = {toUserId:wx.getStorageSync('userId'),msgTypeId:2,showStatus:0,readSta:-1,page:this.data.nowPage,limit:50};
		this.setData({
			loading : true
		}); 
		let { nowPage,msgListData } = this.data;
		util.showLoading('数据加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/MsgCenter/getMsgCenterPageList',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						msgListData.push( ...res.data.datas );
						_this.setData({ 
							msgListData,
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
	goPrimaryPage : function(e){
		var goPageFlag = e.currentTarget.dataset.flag,
			type=e.currentTarget.dataset.type;
		if(goPageFlag){
			//util.navigateTo('/pages/pubDriverZp/index?currPageType=addPub');
			//gasTradeOrder  ->燃气买卖订单管理 我的发布已卖出的气
			//joinCpy->审核人员加入公司
		}
		
	}
})