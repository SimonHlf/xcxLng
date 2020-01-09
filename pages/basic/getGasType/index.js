const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		state:-1,
		carTypeData:[],
		isHasDataFlag : true,
		gasTypeId : '',
	},
	onLoad : function(options){
		this.setData({
			gasTypeId : options.gasTypeId,
		});
		this.getCarTypeList();
	},
	getCarTypeList : function(){
		var _this = this,
			field = {id:''},url = app.globalData.serverUrl + '/qyType/queryGasType';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					if(_this.data.gasTypeId != ''){
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].id == _this.data.gasTypeId){
								_this.setData({
									state : i
								});
							}
						}
					}
					_this.setData({
						carTypeData : res.data.datas
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
	selectCarType : function(e){
		var id = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			gasTypeName : name,
			gasTypeId : id
		});
		wx.navigateBack({
			delta:1
		})
	}
})