const app = getApp();
const util = require('../../utils/util');
var provPyArr = [],provOrderNo = [],lqIdArr = [];
Page({
	data : {
		provData : [],
		lqNameData : [],
		ycName : '',
		isAllEmptyFlag : false,
		gtId : ''
	},
	onLoad : function(options){
		//console.log( options.provOrderNo )
		if(options.provOrderNo != ''){
			provOrderNo = options.provOrderNo.split(',');
			lqIdArr = options.gtId.split(',');
		}
		util.showLoading('加载中...');
		this.getProvList();
		this.getLqType();
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
	//选择液质
	getLqType : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/gasType/queryGasType',
			method:'get',
			data : {id:''},
			success : function(res){
				wx.hideLoading();
				//console.log(res.data.datas)
				if(res.data.code == 200){
					_this.setData({
						lqNameData : res.data.datas
					});
					if(lqIdArr.length > 0){//之前已经选择对应省份 进行匹配
						for(var i=0;i<lqIdArr.length;i++){
							for(var j=0;j<_this.data.lqNameData.length;j++){
								if(lqIdArr[i] == _this.data.lqNameData[j].id){
									_this.data.lqNameData[j].state = 1;
								}
							}
						}
						_this.setData({
							lqNameData: _this.data.lqNameData
						});
					}
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无液质类型数据');
				}
			}
		});
	},
	//选择省份
	selectProv: function (e) {
		var index = e.currentTarget.dataset.index;
		var nowPy = this.data.provData[index].province;
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
			provPyArr.push(this.data.provData[index].province);
			provOrderNo.push(this.data.provData[index].orderNo);
		} 
		this.setData({
			provData: this.data.provData
		});
	}, 
	selectLqType : function(e){
		var index = e.currentTarget.dataset.index;
		var nowLqId = this.data.lqNameData[index].id;
		if(this.data.lqNameData[index].state == 1){
			this.data.lqNameData[index].state = 0;
			for(var i=0;i<lqIdArr.length;i++){
				if(nowLqId == lqIdArr[i]){
					lqIdArr.splice(i,1);
				}
			}
		}else if (this.data.lqNameData[index].state == 0) {
			this.data.lqNameData[index].state = 1;
			lqIdArr.push(this.data.lqNameData[index].id);
		} 
		this.setData({
			lqNameData: this.data.lqNameData
		});
	},
	formSubmit : function(e){
		this.setData({
			ycName : e.detail.value.ycName
		}); 
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(this.data.ycName == '' && provPyArr.length == 0 && lqIdArr.length == 0){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			ycName: this.data.ycName,
			provPy : provPyArr.join(','),
			provOrderNo : provOrderNo.join(','),
			isAllEmptyFlag : this.data.isAllEmptyFlag,
			gtId : lqIdArr.join(',')
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
		lqIdArr.length = 0;
		prevPage.setData({
			ycName: '',
			provPy : '',
			provOrderNo : '',
			isAllEmptyFlag : true,
			gtId : ''
		}) 
		wx.navigateBack({
			delta:1
		})
	}
}) 