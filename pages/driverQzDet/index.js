const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		id : '',
		zpDetData : [],
		isHasDataFlag : true,
		ufId : '',
		serverUrl: app.globalData.serverUrl
	},
	onLoad : function(options){
		this.setData({
			id : options.id
		});
		this.loadZpDet();
	},
	loadZpDet : function(){
		var _this = this;
		var field = {id:this.data.id,userId:wx.getStorageSync('userId')};
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/driverZp/getDriverQzById',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						zpDetData : res.data.datas[0],
						isHasDataFlag : true,
						ufId : res.data.datas[0].ufId
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
					_this.setData({
						isHasDataFlag : false
					});
				}else if(res.data.code == 10002){
					util.showToast('获取司机求职详情参数不能为空');
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
	getPhoneCall : function(e){
		let tel = e.currentTarget.dataset.phone;
		wx.makePhoneCall({
			phoneNumber : tel
		})
	},
	getFocus : function(){
		var _this = this; 
		if(wx.getStorageSync('userId')){
			util.showLoading('关注中...');
			var field = {userId:wx.getStorageSync('userId'),focusId:this.data.id,focusType:'sjqz'};
			wx.request({
				url : app.globalData.serverUrl + '/userCompany/addUserFocus',
				method: 'post',
				header: {
				  'content-type': 'application/x-www-form-urlencoded',
				},
				data : field, 
				success:function(res){
					util.hideLoading(); 
					if(res.data.code == 200){
						util.showToastSuc('关注成功');
						_this.setData({
							userFocus : true ,
							ufId : res.data.datas
						});
					}else if(res.data.code == 1000){
						util.showToast('服务器错误');
					}else if(res.data.code == 50003){
						util.showToast('当前已关注,不能重复关注');
					}
				}
			});
		}
	},
	cancelFocus : function(){
		var _this = this;
		if(wx.getStorageSync('userId')){
			util.showLoading('取消关注中...');
			var field = {ufId:this.data.ufId};
			wx.request({
				url : app.globalData.serverUrl + '/userCompany/delUserFocusById',
				method: 'delete',
				header: {
				  'content-type': 'application/x-www-form-urlencoded',
				},
				data : field,
				success:function(res){
					util.hideLoading();
					console.log(res)
					if(res.data.code == 200){
						util.showToastSuc('取消关注成功');
						_this.setData({
							userFocus : false,
							ufId : ''
						});
					}else if(res.data.code == 1000){
						util.showToast('服务器错误');
					}else if(res.data.code == 50002){
						util.showToast('当前数据错误,暂不能操作');
					}
				}
			});
		}
	}
})