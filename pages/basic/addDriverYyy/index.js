const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		currTit : '',
		driverName : '',
		driverPhone : '',
		cpyId : '',
		psrId : '',
		currJump : ''
	},
	onLoad(options){
		if(options.currJump == 'driverJump'){
			this.setData({ 
				currJump : 'driverJump',
				currTit : '添加公司司机'
			});
			this.setData({
				cpyId : options.cpyId
			});
		}else if(options.currJump == 'yyyJump'){
			this.setData({
				currJump : 'yyyJump',
				currTit : '添加公司押运员'
			});
			this.setData({
				cpyId : options.cpyId
			});
		}else if(options.currJump == 'addByMine'){
			this.setData({
				currJump : 'addByMine',
				currTit : '添加公司司机/押运员'
			});
			this.setData({
				cpyId : options.cpyId
			});
		}else if(options.currJump == 'driverYyyJump'){
			this.setData({
				currJump : 'driverYyyJump',
				currTit : '编辑公司司机/押运员',
				psrId : options.psrId,
				driverName : options.name,
				driverPhone : options.phone
			});
		}
	},
	formSubmit : function(e){
		var _this = this,field = null,url = '',type = '';
		if(e.detail.value.driverName == ''){
			util.showToast('请输入姓名');
			return;
		}
		if(e.detail.value.driverPhone == ''){
			util.showToast('请输入手机号码');
			return;
		}
		if(!app.globalData.regPhone.test( e.detail.value.driverPhone )){
			util.showToast('手机号码格式不对，请重新填写');
			return;
		}
		this.setData({
			driverName : e.detail.value.driverName,
			driverPhone : e.detail.value.driverPhone
		});
		if(this.data.currJump == 'driverJump' ||　this.data.currJump == 'yyyJump' || this.data.currJump == 'addByMine'){
			field = {compId:this.data.cpyId,name:this.data.driverName,mobile:this.data.driverPhone,sex:'',userId:wx.getStorageSync('userId')};
			url = app.globalData.serverUrl + '/company/addCompanyPsr';
			type='post';
		}else if(this.data.currJump == 'driverYyyJump'){
			field = {id:this.data.psrId,name:this.data.driverName,mobile:this.data.driverPhone,sex:''};
			url = app.globalData.serverUrl + '/company/updateCompanyPsr';
			type="put";
		}
		console.log(field)
		console.log(url)
		util.showLoading('加载中...');
		wx.request({
			url : url,
			method:type,
			data :field,
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			},
			success : function(res){
				if(res.data.code == 200){
					util.showToast(_this.data.currTit + '成功');
					if(_this.data.currJump == 'driverJump' ||　_this.data.currJump == 'yyyJump' || _this.data.currJump == 'addByMine'){
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
					}else if(_this.data.currJump == 'driverYyyJump'){
						setTimeout(function(){
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							prevPage.setData({
								isEditFlag_yyr :  true
							})
							wx.navigateBack({
								delta:1
							})
						},1500); 
					}
					
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 70001){
					util.showToast('您暂无增加' + _this.data.currTit + '的权限');
				}
			}
		});
	}
})