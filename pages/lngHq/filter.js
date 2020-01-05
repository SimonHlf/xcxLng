const app = getApp();
const util = require('../../utils/util');
var provPyArr = [],provOrderNo = [];
Page({
	data : {
		provData : [],
		ycName : '',
		isAllEmptyFlag : false
	},
	onLoad : function(options){
		console.log( options.provOrderNo )
		if(options.provOrderNo != ''){
			console.log("jinlaie")
			provOrderNo = options.provOrderNo.split(',');
		}
		util.showLoading('加载中...');
		this.getProvList();
	},
	getProvList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/common/getProvinceList',
			method:'get',
			data : {gsType:0},
			success : function(res){
				wx.hideLoading();
				//console.log(res.data.datas)
				if(res.data.code == 200){
					_this.setData({
						provData : res.data.datas
					});
					if(provOrderNo.length > 0){//之前已经选择对应省份 进行匹配
						for(var i=0;i<provOrderNo.length;i++){
							for(var j=0;j<_this.data.provData.length;j++){
								if(provOrderNo[i] == _this.data.provData[j].orderNo){
									_this.data.provData[j].state = 1;
								}
							}
						}
						_this.setData({
							provData: _this.data.provData
						});
					}
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无省份数据');
				}
			}
		});
	},
	//选择省份
	selectProv: function (e) {
		var index = e.currentTarget.dataset.index;
		var nowPy = this.data.provData[index].provincePy;
		if(this.data.provData[index].state == 1){
			this.data.provData[index].state = 0;
			for(var i=0;i<provPyArr.length;i++){
				if(nowPy == provPyArr[i]){
					provPyArr.splice(i,1);
					provOrderNo.splice(i,1);
				}
			}
		}else if (this.data.provData[index].state == 0) {
			this.data.provData[index].state = 1;
			provPyArr.push(this.data.provData[index].provincePy);
			provOrderNo.push(this.data.provData[index].orderNo);
		} 
		this.setData({
			provData: this.data.provData
		});
	}, 
	formSubmit : function(e){
		this.setData({
			ycName : e.detail.value.ycName
		}); 
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		
		if(this.data.ycName == '' && provPyArr.length == 0){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			ycName: this.data.ycName,
			provPy : provPyArr.join(','),
			provOrderNo : provOrderNo.join(','),
			isAllEmptyFlag : this.data.isAllEmptyFlag
		})
		wx.navigateBack({
			delta:1
		})
	},
	resetFilter : function(){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		provOrderNo.length = 0;
		provPyArr.length = 0;
		prevPage.setData({
			ycName: '',
			provPy : '',
			provOrderNo : '',
			isAllEmptyFlag : true
		})
		wx.navigateBack({
			delta:1
		})
	}
}) 