const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		tradeId : '',
		cpyName : '',
		cpyId : '',
		lxrTel : '',
		buyPrice : '',
		psAddress : '',
		remark : '',
		lxrProv : '请选择省',
		lxrCity : '市',
		isHasSelFlag : false,
	},
	onLoad : function(options){
		this.setData({
			tradeId : options.tradeId
		});
	},
	selectCity : function(e){
		this.setData({
			lxrProv : e.detail.province,
			lxrCity : e.detail.city
		}); 
	},
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addRqDevPage&cpyId=' + this.data.cpyId);
	},
	formSubmit : function(e){
		var submitField = e.detail.value,regNum = /^\+?[1-9]\d*$/;
		console.log(submitField)
		this.setData({
			lxrTel : submitField.lxrTel,
			buyPrice : submitField.buyPrice,
			psAddress : submitField.psAddress,
			remark : submitField.remark
		});
		if(this.data.cpyName == ''){
			util.showToast('请选择公司');
		}else if(this.data.lxrTel == ''){
			util.showToast('请输入您的手机号码');
		}else if(!app.globalData.regPhone.test(this.data.lxrTel)){
			util.showToast('手机号码格式不对');
		}else if(this.data.buyPrice == ''){
			util.showToast('请输入您的报价')
		}else if(!regNum.test( this.data.buyPrice ) ){
			util.showToast('报价应是大于等于0的正整数');
		}else if(this.data.lxrProv == '请选择省'){
			util.showToast('请选择配送区域');
		}else if(this.data.psAddress == ''){
			util.showToast('请输入您的详细地址');
		}else{
			if(wx.getStorageSync('userId')){
				util.showLoading('正在提交...');
				var field = {gtId:this.data.tradeId,userId:wx.getStorageSync('userId'),cpyId:this.data.cpyId,lxMobile:this.data.lxrTel,price:this.data.buyPrice,
							lxrProv:this.data.lxrProv,lxrCity:this.data.lxrCity,lxrAddress:this.data.psAddress,remark:this.data.reamark,lxrGpsInfo:'',distance:0};
				wx.request({
					url : app.globalData.serverUrl + '/gtOrder/addGasTraderOrder',
					method: 'post',
					header: {
					  'content-type': 'application/x-www-form-urlencoded',
					},
					data : field,
					success:function(res){
						util.hideLoading();
						if(res.data.code == 200){
							util.showToast('您已下单成功,请与商家联系确认后进行付款操作');
							setTimeout(function(){
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2];
								prevPage.setData({
									isHasBuyFlag : true
								});
								wx.navigateBack({
									delta:1
								})
							},1800);
						}else if(res.data.code == 1000){
							util.showToast('服务器错误');
						}else if(res.data.code == 30003){
							util.showToast('该交易审核未通过或已下架,不能进行操作');
						}else if(res.data.code == 30004){
							util.showToast('该产品正在交易中,不能进行下单');
						}else if(res.data.code == 30005){
							util.showToast('您已下过单,不能重复下单');
						}
					}
				});
			}
		}
		
	}
})