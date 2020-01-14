const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		tabNav : ['已有公司','待审核','未通过'],
		currentTab : 0,
		compList:[],
		isHasDataFlag : false,
		isPassFlag : true
	},
	onLoad : function(){
		this.loadMyCompList(1);
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index,currSta = 0;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({ 
			currentTab : index
		});
		if(this.data.currentTab == 0){//已审核
			currSta = 1;
			this.setData({
				isPassFlag : true
			});
		}else if(this.data.currentTab == 1){//未审核
			currSta = 0;
			this.setData({
				isPassFlag : false
			});
		}else if(this.data.currentTab == 2){//审核未通过
			currSta = 2;
			this.setData({
				isPassFlag : false
			});
		} 
		this.loadMyCompList(currSta);
	},
	loadMyCompList : function(currSta){ 
		var _this = this; 
		///userCompany/getSelfJoinCompanyList
		var field = {userIdw:wx.getStorageSync('userId'),checkStatus:currSta},url = app.globalData.serverUrl + '/company/getSelfCreateCompanyList';
		console.log(field)
		util.showLoading('加载中...');
		wx.request({
			url : url,
			method:'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						compList : res.data.datas,
						isHasDataFlag : false
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					_this.setData({
						isHasDataFlag : true
					});
				}
			}
		});
	},
	createNewComp : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/createNewComp/index');
		}
	}
})