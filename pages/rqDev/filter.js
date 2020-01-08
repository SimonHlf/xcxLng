const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		lmId : '',
		lxId : '',
		isAllEmptyFlag : false,
		lmState:-1,
		lxState:-1,
		devLmData : [],
		devLxData : []
	},
	onLoad : function(options){
		console.log(options)
		if(options.lmId != ''){
			this.setData({
				lmId : options.lmId 
			});
		}
		if(options.lxId != ''){
			this.setData({
				lxId : options.lxId 
			});
		}
		util.showLoading('加载中...');
		this.getDevLmList(); 
		this.getDevLxList();
	},
	getDevLmList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/rqDevType/queryRqDevType',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					if(_this.data.lmId != ''){
						for(var j=0;j<res.data.datas.length;j++){
							if(_this.data.lmId == res.data.datas[j].id){
								_this.setData({
									lmState : j
								});
							}
						}
					}
					_this.setData({
						devLmData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无燃气设备类目');
				}
			}
		});
	},
	//选择液质
	getDevLxList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/rqType/queryRqType',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					if(_this.data.lxId != ''){
						for(var j=0;j<res.data.datas.length;j++){
							if(_this.data.lxId == res.data.datas[j].id){
								_this.setData({
									lxState : j
								});
							}
						}
					}
					_this.setData({
						devLxData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无燃气设备类型');
				}
			}
		});
	},
	//选择类目
	selectLm: function (e) {
		var id = e.currentTarget.dataset.id;
		this.setData({
			lmState:e.currentTarget.dataset.key,
			lmId : id
		});
		// let pages = getCurrentPages();
		// let prevPage = pages[pages.length - 2];
		// prevPage.setData({
		// 	lmId : id
		// });
	}, 
	selectLx : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			lxState:e.currentTarget.dataset.key,
			lxId : id
		});
		// let pages = getCurrentPages();
		// let prevPage = pages[pages.length - 2];
		// prevPage.setData({
		// 	lxId : id
		// });
	},
	formSubmit : function(e){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(this.data.lmId == '' && this.data.lxId == ''){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			lmId : this.data.lmId,
			lxId : this.data.lxId
		})
		wx.navigateBack({
			delta:1
		}) 
	},
	resetFilter : function(){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			lmId : '',
			lxId : '',
			isAllEmptyFlag : true
		}) 
		wx.navigateBack({
			delta:1
		})
	}
}) 