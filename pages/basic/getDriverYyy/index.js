const app = getApp();
const util = require('../../../utils/util');
var cpyId = '',driver = '',yyyName = '',currJump = '';
Page({
	data : {
		state:-1,
		driverYyyData:[],
		isHasDataFlag : true,
		currTitName : '',
		addNewFlag : false
	},
	onShow(){
		if(this.data.addNewFlag){
			this.getDriverYyyList();
		}
	},
	onHide(){
		this.setData({
			addNewFlag : false
		});
	},
	onLoad : function(options){
		cpyId = options.cpyId;
		currJump = options.currJump;
		if(currJump == 'driverJump'){
			driver = options.driver;
			this.setData({
				currTitName : '选择司机'
			});
		}else if(currJump == 'yyyJump'){
			yyyName = options.yyyName;
			this.setData({
				currTitName : '选择押运员'
			});
		}
		this.getDriverYyyList();
	},
	addDriverYyy : function(){
		util.navigateTo('/pages/basic/addDriverYyy/index?currJump=' + currJump + '&cpyId=' + cpyId);
	},
	getDriverYyyList : function(){
		var _this = this,
			field = {compId:cpyId},url = app.globalData.serverUrl + '/company/queryCompanyPsr';
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(currJump == 'driverJump'){
						if(driver != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].psrName == driver){
									_this.setData({
										state : i
									});
								}
							}
						}
					}else if(currJump == 'yyyJump'){
						if(yyyName != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].psrName == yyyName){
									_this.setData({
										state : i
									});
								}
							}
						}
					}
					_this.setData({
						driverYyyData : res.data.datas,
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
	selectCp : function(e){
		var psrname = e.currentTarget.dataset.psrname,
			psrtel = e.currentTarget.dataset.tel;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(currJump == 'driverJump'){
			prevPage.setData({
				driver : psrname,
				driverTel : psrtel
			});
		}else if(currJump == 'yyyJump'){
			prevPage.setData({
				yyyName : psrname,
				yyyTel : psrtel
			});
		}
		wx.navigateBack({
			delta:1
		})
	}
})