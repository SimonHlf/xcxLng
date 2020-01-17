const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		sexArr : ['男','女'],
		sex:'男',
		birth : '请选择出生年月',
		isSelBirth : false,
		realName : '',
		phoneNum : '',
		isHasDataFlag : true,
		userHead : ''
	},
	onLoad(){
		this.loadMyPerInfo();
	},
	loadMyPerInfo : function(){
		var _this = this;
		if(wx.getStorageSync('userId')){
			util.showLoading('加载中...');
			wx.request({
				url : app.globalData.serverUrl + '/user/getSpecUserDetail',
				method: 'get',
				data:{userId:wx.getStorageSync('userId')},
				success : function(res){
					util.hideLoading();
					if(res.data.code == 200){
						_this.setData({
							userHead : res.data.datas[0].userHead,
							isHasDataFlag : true,
							sex : res.data.datas[0].sex,
							isSelBirth : true,
							realName : res.data.datas[0].realName,
							phoneNum : res.data.datas[0].mobile
						});
						if(res.data.datas[0].birthday == '' ||　res.data.datas[0].birthday == null){
							_this.setData({
								birth : '请选择出生年月',
								isSelBirth : false
							});
						}else{
							_this.setData({
								birth : res.data.datas[0].birthday,
								isSelBirth : true
							});
						}
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
		}
	},
	bindSexPicker : function(e){
		var _this = this;
		this.setData({
			sex : _this.data.sexArr[e.detail.value]
		});
	},
	bindDatePicker : function(e){
		this.setData({
			birth : e.detail.value,
			isSelBirth : true
		});
	},
	formSubmit : function(e){
		var submitField = e.detail.value;
		this.setData({
			realName : submitField.realName,
			phoneNum : submitField.phoneNum
		});
		if(wx.getStorageSync('userId')){
			if(this.data.sex == '请选择性别'){
				util.showToast('请选择性别');
			}else if(this.data.realName == ''){
				util.showToast('请输入您的真实姓名');
			}else if(this.data.birth == '请选择出生年月'){
				util.showToast('请选择出生年月');
			}else if(this.data.phoneNum == ''){
				util.showToast('请输入手机号码');
			}else if(!app.globalData.regPhone.test( this.data.phoneNum )){
				util.showToast('手机号码格式不对，请重新填写');
			}else{
				var field = {userId:wx.getStorageSync('userId'),realName:this.data.realName,mobile:this.data.phoneNum,sex:this.data.sex,birthday:this.data.birth};
				util.showLoading('资料设置中...');
				wx.request({
					url : app.globalData.serverUrl + '/user/updateUser',
					method:'put',
					data:field,
					header: {
					  'content-type': 'application/x-www-form-urlencoded',
					}, 
					success : function(res){
						util.hideLoading();
						if(res.data.code == 200){
							util.showToast('用户信息设置成功');
						}else if(res.data.code == 1000){
							util.showToast('服务器错误');
						}else if(res.data.code == 50001){
							util.showToast('设置失败,当前用户信息不存在');
						}
					}
				});
			}
		}
		
	}
})