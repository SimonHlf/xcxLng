const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		wholeIndexData : []
	},
	onLoad(){
		this.loadIndexData()
	},
	loadIndexData(){
		let _this = this;
		util.showLoading('数据加载中...')
		wx.request({
			url : app.globalData.serverUrl + '/common/getWelcomeData',
			method : 'get',
			success: function(res){ 
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
	}
})