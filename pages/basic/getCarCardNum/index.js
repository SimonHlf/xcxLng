const app = getApp();
const util = require('../../../utils/util');
var cpyId = '',carCardNum = '',gcCardNum = '',currJump = '';
Page({
	data : {
		state:-1,
		cardNum:[],
		isHasDataFlag : true,
		currTitName : '',
		addNewFlag : false
	},
	onShow(){
		if(this.data.addNewFlag){
			this.getCphList();
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
		if(currJump == 'cpJump'){
			carCardNum = options.carCardNum;
			this.setData({
				currTitName : '选择车牌号'
			});
		}else if(currJump == 'gccpJump'){
			gcCardNum = options.gcCardNum;
			this.setData({
				currTitName : '选择挂车车牌号'
			});
		}
		this.getCphList();
	},
	addCpNum : function(){
		util.navigateTo('/pages/basic/addCpGcpNum/index?currJump=' + currJump + '&cpyId=' + cpyId);
	},
	getCphList : function(){
		var _this = this,
			field = {cpyId:cpyId},url = '';
		if(currJump == 'cpJump'){
			url =  app.globalData.serverUrl + '/company/queryHeadCP';
		}else if(currJump == 'gccpJump'){
			url =  app.globalData.serverUrl + '/company/queryCompanyGcCP';
		}
		util.showLoading('加载中...');
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					if(currJump == 'cpJump'){
						if(carCardNum != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].cph == carCardNum){
									_this.setData({
										state : i
									});
								}
							}
						}
					}else if(currJump == 'gccpJump'){
						if(gcCardNum != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].cph == gcCardNum){
									_this.setData({
										state : i
									});
								}
							}
						}
					}
					_this.setData({
						cardNum : res.data.datas
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
		var cph = e.currentTarget.dataset.cph;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(currJump == 'cpJump'){
			prevPage.setData({
				carCardNum : cph
			});
		}else if(currJump == 'gccpJump'){
			prevPage.setData({
				gcCardNum : cph
			});
		}
		wx.navigateBack({
			delta:1
		})
	}
})