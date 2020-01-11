const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		currTit : '',
		driverName : '',
		driverPhone : '',
		cpyId : ''
	},
	onLoad(options){
		if(options.currJump == 'driverJump'){
			this.setData({ 
				currTit : '公司司机'
			});
		}else if(options.currJump == 'yyyJump'){
			this.setData({
				currTit : '公司押运员'
			});
		}
		this.setData({
			cpyId : options.cpyId
		});
	},
	formSubmit : function(e){
		var _this = this,field = null,url = '',regPhone = /^1\d{10}$/;
		if(e.detail.value.driverName == ''){
			util.showToast('请输入姓名');
			return;
		}
		if(e.detail.value.driverPhone == ''){
			util.showToast('请输入手机号码');
			return;
		}
		if(!regPhone.test( e.detail.value.driverPhone ) && e.detail.value.driverPhone.length != 11){
			util.showToast('手机号码格式不对，请重新填写');
		}
		this.setData({
			driverName : e.detail.value.driverName,
			driverPhone : e.detail.value.driverPhone
		});
		field = {compId:this.data.cpyId,name:this.data.driverName,mobile:this.data.driverPhone,sex:''};
		url = app.globalData.serverUrl + '/company/addCompanyPsr';
		wx.request({
			url : url,
			method:'post',
			data :field,
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			},
			success : function(res){
				if(res.data.code == 200){
					util.showToast('添加' + _this.data.currTit + '成功');
					setTimeout(function(){
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.setData({
							addNewFlag :  true
						})
						wx.navigateBack({
							delta:1
						})
					},1500); 
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 70001){
					util.showToast('您暂无增加' + _this.data.currTit + '的权限');
				}
			}
		});
	}
})