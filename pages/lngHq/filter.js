const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		test : []
	},
	onLoad : function(){
	
	},
	getProvList : function(){
		wx.request({
			url : app.globalData.serverUrl + '/common/getProvinceList',
			method:'get',
			data : {gsType:0},
			async : false,
			success : function(res){
				//console.log(res.data.datas)
				if(res.data.code == 200){
					provData = res.data.datas;
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无省份数据');
				}
			}
		});
	},
}) 