const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		spYear : '',
		potPpId : '',
		headPpId : '',
		isAllEmptyFlag : false,
		potBandState:-1,
		headPpState:-1,
		potBandData : [], 
		headPpData : [],
		spnf : '请选择车头上牌年份',
		isSelDate_year : false
	},
	bindDateChange : function(e){
		this.setData({
			spnf : e.detail.value,
			isSelDate_year : true,
			spYear : e.detail.value
		});
	},
	onLoad : function(options){
		if(options.spYear != ''){
			this.setData({
				spYear : options.spYear 
			});
		}
		if(options.potPpId != ''){
			this.setData({
				potPpId : options.potPpId 
			});
		}
		if(options.headPpId != ''){
			this.setData({
				headPpId : options.headPpId 
			});
		}
		util.showLoading('加载中...');
		this.getPotBandList(); 
		this.getHeadPpList();
	},
	//选择储罐品牌
	getPotBandList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/tPotPp/queryTPotPp',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					if(_this.data.potPpId != ''){
						for(var j=0;j<res.data.datas.length;j++){
							if(_this.data.potPpId == res.data.datas[j].id){
								_this.setData({
									potBandState : j
								});
							}
						}
					}
					_this.setData({
						potBandData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无储罐品牌');
				}
			}
		});
	},
	//获取车头品牌
	getHeadPpList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/tHeadPp/queryTHeadPp',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					if(_this.data.headPpId != ''){
						for(var j=0;j<res.data.datas.length;j++){
							if(_this.data.headPpId == res.data.datas[j].id){
								_this.setData({
									headPpState : j
								});
							}
						}
					}
					_this.setData({
						headPpData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无车头品牌');
				}
			}
		});
	},
	//选择储罐皮牌
	selectPotBand: function (e) {
		var id = e.currentTarget.dataset.id;
		this.setData({
			potBandState:e.currentTarget.dataset.key,
			potPpId : id
		});
	}, 
	selectHeadPp : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			headPpState:e.currentTarget.dataset.key,
			headPpId : id
		});
	},
	formSubmit : function(e){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(this.data.spYear == '' && this.data.potPpId == '' && this.data.headPpId == ''){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			spYear : this.data.spYear,
			potPpId : this.data.potPpId,
			headPpId : this.data.headPpId,
			isAllEmptyFlag : this.data.isAllEmptyFlag
		})
		wx.navigateBack({
			delta:1
		}) 
	},
	resetFilter : function(){
		var _this = this;
		this.setData({
			spnf : '请选择上牌年份',
			isSelDate_year : false
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			spYear : '',
			potPpId : '',
			headPpId : '',
			isAllEmptyFlag : true
		}) 
		wx.navigateBack({
			delta:1
		})
	}
}) 