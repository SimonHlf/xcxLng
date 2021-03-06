const app = getApp();
const util = require('../../../utils/util');
var currPage = '',cpyId = '';
Page({
	data : {
		state:-1,
		cpyData:[],
		isHasDataFlag : true,
		address : '',
		currTit : ''
	},
	onLoad : function(options){
		currPage = options.currPage;
		if(options.currPage == 'addRqTradePage'){
			this.setData({
				currTit : '贸易商'
			});
		}else{
			this.setData({
				currTit : '公司'
			});
		}
		cpyId = options.cpyId;
		this.getCpyList();
	},
	getCpyList : function(){ 
		var _this = this,
			field = null;
		currPage == 'addRqTradePage' ? field = {typeName:'LNG贸易商',checkStatus:1,opt:1,userId:wx.getStorageSync('userId')} : field = {checkStatus:1,opt:1,userId:wx.getStorageSync('userId')};
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/company/getCompanyList',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(cpyId != ''){//之前已经选择对应公司 进行匹配
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].cpyId == cpyId){
								_this.setData({
									state : i
								});
							}
						}
					}
					_this.setData({
						cpyData : res.data.datas,
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
	selectCpy : function(e){
		var cpyName = e.currentTarget.dataset.cpyname,
			cpyId = e.currentTarget.dataset.cpyid,
			dz = e.currentTarget.dataset.dz,
			lxrTel = e.currentTarget.dataset.lxrtel,
			lxrName = e.currentTarget.dataset.lxrname;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			cpyName : cpyName,
			cpyId : cpyId
		});
		if(currPage == 'addDriverZpPage'){
			prevPage.setData({
				address : dz,
				isBackBySelComp : true,
				lxName : lxrName,
				lxTel : lxrTel,
			});
		}
		wx.navigateBack({
			delta:1
		})
	}
})