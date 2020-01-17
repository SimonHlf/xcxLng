const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		currJump : 'comeByMyComp',
		tabNav : ['已有公司','待审核','未通过'],
		currentTab : 0,
		compList:[],
		isPassFlag : true,
		isCanPubFlag : false,
		currSta : 1,
		isDealFlag : false
	}, 
	onLoad : function(options){
		this.setData({
			//currJump : options.currJump
		});
		this.loadMyCompList(1);
	},
	onShow(){
		if(this.data.isCanPubFlag){//从最新发布页面返回过来并且已经发布
			this.loadMyCompList(this.data.currSta); 
		}
		if(this.data.isDealFlag){//说明在申请页面已经处理申请并返回
			this.loadMyCompList(1); 
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isDealFlag : false
		});
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
				isPassFlag : true,
				currSta : 1
			});
		}else if(this.data.currentTab == 1){//未审核
			currSta = 0;
			this.setData({
				isPassFlag : false,
				currSta : 0
			});
		}else if(this.data.currentTab == 2){//审核未通过
			currSta = 2;
			this.setData({
				isPassFlag : false,
				currSta : 2
			});
		} 
		this.loadMyCompList(currSta);
	},
	loadMyCompList : function(currSta){ 
		var _this = this,url = ''; 
		if(this.data.currJump == 'comeByMyComp'){
			url = app.globalData.serverUrl + '/company/getSelfCreateCompanyList';
			wx.setNavigationBarTitle({
				title: '我的公司' 
			})
		}else if(this.data.currJump == 'comeByJoinComp'){
			wx.setNavigationBarTitle({
				title: '已加入公司' 
			})
			url = app.globalData.serverUrl + '/userCompany/getSelfJoinCompanyList';
		}
		var field = {userId:wx.getStorageSync('userId'),checkStatus:currSta};
		//console.log(field)
		util.showLoading('加载中...');
		wx.request({
			url : url,
			method:'get',
			data:field,
			success : function(res){
				util.hideLoading();
				//console.log(res)
				if(res.data.code == 200){
					_this.setData({
						compList : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					_this.setData({
						compList : []
					});
				}
			}
		});
	},
	createNewComp : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/createNewComp/index?currPageType=addPub&currSta=' + this.data.currSta);
		}
	},
	editMyCompany : function(e){
		let cpyId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/createNewComp/index?currPageType=editPub&cpyId=' + cpyId + '&currSta=' + this.data.currSta);
	},
	viewCompDet : function(e){
		let cpyId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/myCompany/companyDet?cpyId=' + cpyId);
	},
	joinHotComp : function(){
		util.navigateTo('/pages/joinCompany/index');
	},
	goDetalWidth : function(e){
		let cpyId = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name;
		util.navigateTo('/pages/dealWithCompApply/index?cpyId=' + cpyId + '&name=' + name);
	}
})