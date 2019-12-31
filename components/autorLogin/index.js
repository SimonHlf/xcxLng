const app = getApp();
Component({
	data : {
		isAuthor : false//是否已经授权
	},
	lifetimes : {
		attached(){
			this.setData({
				isAuthor : app.globalData.isAuthor
			});
		}
	},
	methods : {
		goOn(){
			this.triggerEvent('flagEvent', {});
		},
		//授权
		bindGetUserInfo(e){
			let that = this;
			if(e.detail.userInfo){
				app.globalData.wxInfo = e.detail.userInfo;
				//获取登录信息
				that.getLoginInfo();
			}else{
				console.log('用户点击了拒绝授权');
			}
		},
		getLoginInfo(){
			let that = this;
			wx.login({
				success(res){
					if(res.code){
						wx.request({
							url : '/wxUserLogin',
							data : {code: res.code}
						})
					}
				}
			});
		}
	}
});