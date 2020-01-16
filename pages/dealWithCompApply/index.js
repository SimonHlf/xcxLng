const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		cpyId : '',
		cpyName : '',
		dealList : []
	},
	onLoad : function(options){
		var _this = this;
		this.setData({
			cpyId : options.cpyId,
			cpyName : options.name
		});
		wx.setNavigationBarTitle({
			title : "加入公司" + _this.data.cpyName + "申请"
		});
		this.loadDealList();
	},
	loadDealList : function(){
		var _this = this;
		util.showLoading('加载中...');
		var url = app.globalData.serverUrl + '/userCompany/queryUserCompany',field = {compId:this.data.cpyId,userId:wx.getStorageSync('userId'),checkStatus:0};
		wx.request({
			url : url,
			method:'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						dealList : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					_this.setData({
						dealList : []
					});
				}
			}
		});
	},
	agreeJoin : function(e){
		let num = e.currentTarget.dataset.num,
			username = e.currentTarget.dataset.username,_this = this,
			id = e.currentTarget.dataset.id;
		wx.showModal({
			title: '同意提示',
			content: '确定要同意'+ username + '加入公司' + _this.data.cpyName + '的申请',
			success: function(res) {
				if(res.confirm) {
					_this.dealRequest(1,id);
				}else if(res.cancel){}
			}
		});
	},
	refuseJoin : function(e){
		let num = e.currentTarget.dataset.num,
			username = e.currentTarget.dataset.username,_this = this,
			id = e.currentTarget.dataset.id;
		wx.showModal({
			title: '拒绝提示',
			content: '确定要拒绝'+ username + '加入公司' + _this.data.cpyName + '的申请',
			success: function(res) {
				if(res.confirm) { 
					_this.dealRequest(2,id); 
				}else if(res.cancel){}
			}
		});
	},
	dealRequest : function(currStatus,id){
		var field = {checkSta:currStatus,id:id},_this = this;
		util.showLoading('处理中...');
		wx.request({
			url :app.globalData.serverUrl + '/userCompany/updateUserCompanyBySta',
			method:'put',
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			},
			data :field,
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					console.log(res)
					util.showToastSuc('处理成功');
					setTimeout(function(){
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.setData({
							isDealFlag : true
						});
						_this.loadDealList();
					},1800);
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('当前员工申请不存在');
				}else if(res.data.code == 70001){
					util.showToast('抱歉,您暂无处理员工加入申请的权限');
				}
			}
		});
	}
})