const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		isLogin : false,
		userImg : '',
		userName : '',
		isShowFlag_page : false
	},
	onLoad : function(){
		 
	},   
	onShow : function(e){
		if(wx.getStorageSync('userId')){ 
			 //处于登录状态
			this.setData({ 
			 	isLogin : true ,
				isShowFlag_page : true
			});   
			this.setData({
				userImg : wx.getStorageSync('userInfo').avatarUrl,
				userName : wx.getStorageSync('userInfo').nickName
			}); 
		}else{  
			this.setData({
				isLogin : false,
				isShowFlag_page : false
			}); 
			this.commonLogin();
		}
	},
	goAuthLogin : function(e){
		this.setData({
			isShowFlag_page : e.detail.isShowFlag
		});
		this.commonLogin();
	},
	commonLogin : function(){
		if(wx.getStorageSync('userId')){
			this.setData({
				isLogin : true,
				userImg : wx.getStorageSync('userInfo').avatarUrl,
				userName : wx.getStorageSync('userInfo').nickName
			});
		}
	},
	editMyInfo : function(){
		util.navigateTo('/pages/perInfo/index');
	},
	goMyCompany : function(){
		util.navigateTo('/pages/myCompany/index?currJump=comeByMyComp');
	},
	goMyJoinCompany : function(){
		util.navigateTo('/pages/myCompany/index?currJump=comeByJoinComp');
	},
	goFeedBack : function(){
		util.navigateTo('/pages/feedBack/index');
	}
}) 