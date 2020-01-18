var util = require('../../utils/util.js');
const app = getApp();
Component({ 
	data : {
		isAuthor : false,//是否已经授权
		isShowFlag : true
	},   
	attached() {   
		let that = this;   
		wx.checkSession({   
			success : function(){
			},          
			fail : function(){  
				that.setData({ 
				  isAuthor: false
				})
				wx.removeStorageSync('userId');
				wx.removeStorageSync('userInfo');
			}   
		})   
		wx.getSetting({
			success:function(res){
				if(!res.authSetting['scope.userInfo']){
					that.setData({
					  isAuthor: false
					}) 
					wx.removeStorageSync('userId'); 
					wx.removeStorageSync('userInfo');
				}
			}  
		});    
		if(wx.getStorageSync("userId")){
			this.setData({
			  isAuthor: true, 
			  isShowFlag : true
			}) 
		}else{ 
			this.setData({
			  isAuthor: false,
			  isShowFlag : false
			}) 
		}
		console.log(this.data.isAuthor)
	} ,    
	methods : {    
		goOn(){ 
			this.triggerEvent('flagEvent', {isShowFlag:this.data.isShowFlag});
		},  
		//授权  
		bindGetUserInfo(e){
			let that = this; 
			if(e.detail.userInfo){
				that.setData({
					isShowFlag : true
				});
				wx.setStorageSync('userInfo',e.detail.userInfo)
				//获取登录信息
				that.getLoginInfo(e.detail.encryptedData,e.detail.iv);
			}else{ 
				util.showToast('为了您更好的体验,请先同意授权');
				that.setData({
					isShowFlag : false
				});
				this.triggerEvent('flagEvent', {isShowFlag:that.data.isShowFlag});
			}
		},
		getLoginInfo(encryptedData,iv){ 
			let that = this;  
			wx.login({ 
				success(res){
					if(res.code){
						wx.request({ 
							url: app.globalData.serverUrl + '/wxAuth',
							method : 'get',   
							data: {code : res.code},
							success : function(json){
								if(json.data.code == 200){
									that.login(res.code,encryptedData,iv,json.data.datas[0].sessionKey,json.data.datas[0].openId);
								}else if(json.data.code == 1000){
									util.showToast('服务器错误');
								}else if(json.data.code == 10002){
									util.showToast('请求参数不能为空');
								}else if(json.data.code == 20008){
									util.showToast('授权失败');
								} 
							}
						}) 
					} 
				}     
			});   
		},    
		login : function(code,encryptedData,iv,sessionKey,openId){
			var field =  {code:code,encryptedData:encryptedData,iv:iv,sessionKey:sessionKey,openId:openId};
			let that = this;
			util.showLoading('登录中...');
			wx.request({
				url :　app.globalData.serverUrl + '/wxUserLogin',
				method: 'get',  
				data :field,
				success: function(res){ 
					util.hideLoading();
					console.log(res) 
					if(res.data.code == 200){  
						util.showToastSuc('登录成功');
						that.setData({  
							isAuthor : true,
							isShowFlag : true
						});
						wx.setStorageSync('userId',res.data.datas[0].userId);
						that.triggerEvent('flagEvent', {isShowFlag:that.data.isShowFlag});//登录成功后继续执行
					}else if(res.data.code == 10002){
						util.showToast('请求参数不能为空');
					}else if(res.data.code == 20002){
						util.showToast('用户不存在');
					}else if(res.data.code == 20008){
						util.showToast('登录失败,请重新尝试');
					}else if(res.data.code == 20003){
						util.showToast('当前账号已被禁用,请联系管理员');
					}else if(res.data.code == 40001){
						util.showToast('系统繁忙,请稍后重试');
					}
				}
			});
		}
	}
});