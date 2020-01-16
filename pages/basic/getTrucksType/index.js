const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		state:-1,
		carTypeData:[],
		isHasDataFlag : true,
		truckTypeId : '',
		carTypeId : '',
		currTitle : ''
	},
	onLoad : function(options){
		let tmpTit = options.truckTypeId == 1 ? '普货车辆类型' : '危货车辆类型';
		this.setData({
			truckTypeId : options.truckTypeId,
			carTypeId : options.carTypeId,
			currTitle : tmpTit
		});
		this.getCarTypeList();
	},
	getCarTypeList : function(){
		var _this = this,
			field = {type:this.data.truckTypeId},url = app.globalData.serverUrl + '/trucksType/queryTrTypeByType';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(_this.data.carTypeId != ''){
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].id == _this.data.carTypeId){
								_this.setData({
									state : i
								});
							}
						}
					}
					_this.setData({
						carTypeData : res.data.datas,
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
	selectCarType : function(e){
		var id = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			carTypeName : name,
			carTypeId : id
		});
		wx.navigateBack({
			delta:1
		})
	}
})