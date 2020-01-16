const app = getApp();
const util = require('../../../utils/util');
var psAreaName = '',tmpProvArr = [],tmpProvNo = [];
Page({
	data : {
		state:-1,
		provData:[],
		isHasDataFlag : true
	},
	onLoad : function(options){
		if(options.provOrderNo != ''){
			tmpProvNo = options.provOrderNo.split(',');
		}
		this.getPsArea();
	},
	getPsArea : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/common/getProvinceList',
			method:'get', 
			data : {gsType:0},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						provData : res.data.datas
					});
					if(tmpProvNo.length > 0){//之前已经选择对应省份 进行匹配
						for(var i=0;i<tmpProvNo.length;i++){
							for(var j=0;j<_this.data.provData.length;j++){
								if(tmpProvNo[i] == _this.data.provData[j].orderNo){
									_this.data.provData[j].state = 1;
								}
							} 
						}
						_this.setData({
							provData: _this.data.provData,
							isHasDataFlag : true
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
	selectProv : function(e){
		var index = e.currentTarget.dataset.index;
		var nowPy = this.data.provData[index].province;
		if(this.data.provData[index].state == 1){
			this.data.provData[index].state = 0;
			for(var i=0;i<tmpProvArr.length;i++){
				if(nowPy == tmpProvArr[i]){
					tmpProvArr.splice(i,1);
					tmpProvNo.splice(i,1);
				}
			}
		}else if (this.data.provData[index].state == 0) {
			this.data.provData[index].state = 1;
			tmpProvArr.push(this.data.provData[index].province);
			tmpProvNo.push(this.data.provData[index].orderNo);
		} 
		this.setData({
			provData: this.data.provData
		});
	},
	savePsArea : function(){
		if(tmpProvArr.length == 0){
			util.showToast('请至少选择一个配送区域');
		}else if(tmpProvArr.length > 5){
			util.showToast('配送区域最多可选5个');
		}else{
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];
			prevPage.setData({
				psAreaName : tmpProvArr.join(','),
				provOrderNo : tmpProvNo.join(','),
				isSelPsArea : true
			});
			wx.navigateBack({
				delta:1
			})
		}
	}
})