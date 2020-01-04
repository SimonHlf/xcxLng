const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		gfId : '',
		mysList:[],
		isHasDataFlag : false
	},
	onLoad(options){
		this.setData({
			gfId : options.gfId
		});
		this.loadMysList();
	},
	loadMysList : function(){
		var _this = this;
		wx.request({ 
			url : app.globalData.serverUrl + '/lng/getSpecGasFactoryCpy',
			method:'get',
			data : {gfId:_this.data.gfId,checkStatus:1},
			success : function(res){
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						mysList : res.data.datas,
						isHasDataFlag : true
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 10002){
					util.showToast('获取数据参数不能为空');
				}else if(res.data.code == 50001){
					//util.showToast('当前液厂液质报告图不存在');
				}
			}
		});
	},
	callMys : function(e){
		let tel = e.currentTarget.dataset.tel;
		wx.makePhoneCall({
			phoneNumber : tel
		})
	}
})