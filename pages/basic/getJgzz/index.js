const app = getApp();
const util = require('../../../utils/util');
var jgzzArr = [],jgzzArrName = [];
Page({
	data : {
		state:-1,
		carTypeData:[],
		isHasDataFlag : true,
		jgzzId : ''
	},
	onLoad : function(options){
		if(options.jgzzId != ''){
			jgzzArr = options.jgzzId.split(',');
		}
		this.setData({
			jgzzId : options.jgzzId
		});
		this.getCarHeadTypeList();
	},
	onHide(){
		jgzzArr.length = 0;
		jgzzArrName.length = 0;
	},
	getCarHeadTypeList : function(){
		var _this = this,
			field = {validSta:0},url = app.globalData.serverUrl + '/qual/queryQual';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						carTypeData : res.data.datas
					});
					if(jgzzArr.length > 0){
						for(var i=0;i<jgzzArr.length;i++){
							for(var j=0;j<_this.data.carTypeData.length;j++){
								if(jgzzArr[i] == _this.data.carTypeData[j].id){
									_this.data.carTypeData[j].state = 1;
								}
							}
						}
						_this.setData({
							carTypeData: _this.data.carTypeData
						});
					}
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
		var index = e.currentTarget.dataset.index,
			name = e.currentTarget.dataset.name;
		var nowName = this.data.carTypeData[index].name;
		if(this.data.carTypeData[index].state == 1){
			this.data.carTypeData[index].state = 0;
			for(var i=0;i<jgzzArrName.length;i++){
				if(nowName == jgzzArrName[i]){
					jgzzArrName.splice(i,1);
					jgzzArr.splice(i,1);
				}
			}
		}else if (this.data.carTypeData[index].state == 0) {
			this.data.carTypeData[index].state = 1;
			jgzzArr.push(this.data.carTypeData[index].id);
			jgzzArrName.push(this.data.carTypeData[index].name);
		} 
		this.setData({
			carTypeData: this.data.carTypeData
		});
	},
	selJgzz : function(){
		if(jgzzArr.length == 0){
			util.showToast('请至少选择一项进港资质');
			return;
		}
		if(jgzzArr.length>5){
			util.showToast('进港资质最多可以选5个');
			return;
		}
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			jgzzName: jgzzArrName.join(','),
			jgzzId : jgzzArr.join(','),
		})
		wx.navigateBack({
			delta:1
		})
		
	}
})