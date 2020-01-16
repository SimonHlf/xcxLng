const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		state:-1,
		potBandData:[],
		isHasDataFlag : true,
		potBandId : ''
	},
	onLoad : function(options){
		this.setData({
			potBandId : options.potBandId
		});
		this.getPotBandList();
	},
	getPotBandList : function(){
		var _this = this,
			field = {id:''},url = app.globalData.serverUrl + '/tPotPp/queryTPotPp';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(_this.data.potBandId != ''){
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].id == _this.data.potBandId){
								_this.setData({
									state : i
								});
							}
						}
					}
					_this.setData({
						potBandData : res.data.datas,
						isHasDataFlag : true
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
					_this.setData({
						isHasDataFlag : false
					});
				}else if(res.data.code == 50001){
					_this.setData({
						isHasDataFlag : false
					});
				}
			} 
		});
	},
	selectPot : function(e){
		var id = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			potBandName : name,
			potBandId : id
		});
		wx.navigateBack({
			delta:1
		})
	}
})