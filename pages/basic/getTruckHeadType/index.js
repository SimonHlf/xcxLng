const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		state:-1,
		carTypeData:[],
		isHasDataFlag : true,
		ctTypeId : ''
	},
	onLoad : function(options){
		this.setData({
			ctTypeId : options.ctTypeId
		});
		this.getCarHeadTypeList();
	},
	getCarHeadTypeList : function(){
		var _this = this,
			field = {id:''},url = app.globalData.serverUrl + '/tHeadType/queryTHeadType';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(_this.data.ctTypeId != ''){
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].id == _this.data.ctTypeId){
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
			ctTypeName : name,
			ctTypeId : id
		});
		wx.navigateBack({
			delta:1
		})
	}
})