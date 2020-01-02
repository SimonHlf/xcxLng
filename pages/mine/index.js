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
		console.log(e.detail.isShowFlag)
		this.setData({
			isShowFlag_page : e.detail.isShowFlag
		});
		this.commonLogin();
	},
	commonLogin : function(){
		console.log("zhixingmei?")
		console.log(wx.getStorageSync('userId'))
		if(wx.getStorageSync('userId')){
			this.setData({
				isLogin : true,
				userImg : wx.getStorageSync('userInfo').avatarUrl,
				userName : wx.getStorageSync('userInfo').nickName
			});
		}
	}
})