const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		sxInfo : '',
		potPpId : '',
		zzjzTypeId : '',
		isAllEmptyFlag : false,
		potBandState:-1,
		sxState : -1,
		zzjzState:-1,
		potBandData : [],
		sxInfoData : [
			{
				id:1,
				name:"有手续"
			},
			{
				id:2,
				name:"无手续"
			}
		],
		zzjzData : []
	},
	onLoad : function(options){
		if(options.sxInfo != ''){
			this.setData({
				sxInfo : options.sxInfo 
			});
			for(var j=0;j<this.data.sxInfoData.length;j++){
				if(this.data.sxInfo == this.data.sxInfoData[j].id){
					this.setData({
						sxState : j
					});
				}
			}
		}
		if(options.potPpId != ''){
			this.setData({
				potPpId : options.potPpId 
			});
		}
		if(options.zzjzTypeId != ''){
			this.setData({
				zzjzTypeId : options.zzjzTypeId 
			});
		}
		util.showLoading('加载中...');
		this.getPotBandList(); 
		this.getZzjzList();
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
	//选择装载介质
	getZzjzList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/potZzjzType/queryPotZzjzType',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					if(_this.data.zzjzTypeId != ''){
						for(var j=0;j<res.data.datas.length;j++){
							if(_this.data.zzjzTypeId == res.data.datas[j].id){
								_this.setData({
									zzjzState : j
								});
							}
						}
					}
					_this.setData({
						zzjzData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无装载介质');
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
	selectSx : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			sxState:e.currentTarget.dataset.key,
			sxInfo : id
		});
	},
	selectZzjz : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			zzjzState:e.currentTarget.dataset.key,
			zzjzTypeId : id
		});
	},
	formSubmit : function(e){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(this.data.sxInfo == '' && this.data.potPpId == '' && this.data.zzjzTypeId == ''){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			sxInfo : this.data.sxInfo,
			potPpId : this.data.potPpId,
			zzjzTypeId : this.data.zzjzTypeId,
			isAllEmptyFlag : this.data.isAllEmptyFlag
		})
		wx.navigateBack({
			delta:1
		}) 
	},
	resetFilter : function(){
		var _this = this;
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			sxInfo : '',
			potPpId : '',
			zzjzTypeId : '',
			isAllEmptyFlag : true
		}) 
		wx.navigateBack({
			delta:1
		})
	}
}) 