const app = getApp();
const util = require('../../utils/util');
var previewImgArr = [];
Page({
	data:{
		removeFlag : true,
		cpyId : '',
		compInfoData : [],
		originYyzzImg : '',
		serverUrl : app.globalData.serverUrl,
		tabNav : ['公司信息','公司员工','司机/押运人',"车头车牌","挂车车牌"],
		currentTab : 0,
		state : -1,
		staffData : [],
		loadDriverYyy : [],
		ctNumData : [],
		gcNumData :[],
		isEditFlag_yyr : false,
		addNewFlag : false,
		addNewFlag_ct : false,
		isEditFlag_ct : false,
		addNewFlag_gc : false,
		isEditFlag_gc : false,
		hasDealCtNum : '',
		hasDealGcNum : ''
	},
	onLoad : function(options){
		previewImgArr.length = 0;
		this.setData({
			cpyId : options.cpyId
		});
		this.loadCompDet();
	},
	onShow : function(){
		if(this.data.isEditFlag_yyr || this.data.addNewFlag){
			this.loadDriverYyy();
		}
		if(this.data.isEditFlag_ct || this.data.addNewFlag_ct){
			this.loadCtNum();
		}
		if(this.data.isEditFlag_gc || this.data.addNewFlag_gc){
			this.loadGcNum();
		}
	},
	onHide : function(){
		this.setData({
			isEditFlag_yyr : false,
			addNewFlag : false,
			addNewFlag_ct : false,
			isEditFlag_ct : false,
			addNewFlag_gc : false,
			isEditFlag_gc : false
		});
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index,currSta = 0;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({ 
			currentTab : index
		});
		if(this.data.currentTab == 0){//公司信息
		}else if(this.data.currentTab == 1){//公司员工
			this.loadCompStaff();
		}else if(this.data.currentTab == 2){//司机/押运人
			this.loadDriverYyy();
		}else if(this.data.currentTab == 3){
			this.loadCtNum();
		}else if(this.data.currentTab == 4){
			this.loadGcNum();
			console.log("jinlaiel")
		}
	},
	loadCompStaff : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/userCompany/queryUserCompany',
			method:'get',
			data :{compId:_this.data.cpyId,userId:wx.getStorageSync('userId'),checkStatus:1},
			success : function(res){
				console.log(res)
				wx.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						staffData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无当前公司信息');
				}
			}
		});
	},
	//获取司机押运人
	loadDriverYyy : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/company/queryCompanyPsr',
			method:'get',
			data :{compId:_this.data.cpyId},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						loadDriverYyy : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
				}
			}
		});
	},
	//加载车头车牌
	loadCtNum : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/company/queryHeadCP',
			method:'get',
			data :{compId:_this.data.cpyId},
			success : function(res){
				console.log(res)
				wx.hideLoading(); 
				if(res.data.code == 200){
					_this.setData({
						ctNumData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					//util.showToast('暂无司机/押运人信息');
				}
			}
		});
	},
	//加载挂车车牌
	loadGcNum : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/company/queryCompanyGcCP',
			method:'get',
			data :{compId:_this.data.cpyId},
			success : function(res){
				console.log(res)
				wx.hideLoading(); 
				if(res.data.code == 200){
					_this.setData({
						gcNumData : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					//util.showToast('暂无司机/押运人信息');
				}
			}
		});
	},
	//编辑司机押运人
	editYyyInfo : function(e){
		let psrId = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name,
			phone = e.currentTarget.dataset.phone;
		util.navigateTo('/pages/basic/addDriverYyy/index?currJump=driverYyyJump&psrId=' + psrId + '&name=' + name +'&phone=' + phone);
	},
	//添加司机押运人
	addDriverYyy : function(){
		util.navigateTo('/pages/basic/addDriverYyy/index?currJump=addByMine&cpyId=' + this.data.cpyId);
	},
	//添加车头车牌
	addCtNum : function(){
		util.navigateTo('/pages/basic/addCpGcpNum/index?currJump=addByMine_ct&cpyId=' + this.data.cpyId);
	},
	//添加挂车车牌
	addGcNum : function(){
		util.navigateTo('/pages/basic/addCpGcpNum/index?currJump=addByMine_gc&cpyId=' + this.data.cpyId);
	},
	//编辑车头车牌
	editCtNum : function(e){
		let id = e.currentTarget.dataset.id,
			cph = e.currentTarget.dataset.cph;
		util.navigateTo('/pages/basic/addCpGcpNum/index?currJump=editCphJump&id=' + id + '&cph=' + cph);
	},
	editGcNum : function(e){
		let id = e.currentTarget.dataset.id,
			gch = e.currentTarget.dataset.cph;
		util.navigateTo('/pages/basic/addCpGcpNum/index?currJump=editGcJump&id=' + id + '&gch=' + gch);
	},
	delUser : function(e){
		var _this = this,userId = e.currentTarget.dataset.userid,cpyId = e.currentTarget.dataset.cpyid,name=e.currentTarget.dataset.name;
		wx.showModal({
			title: '删除提示',
			content: '确定要删除员工'+ name,
			success: function(res) {
				if(res.confirm) {
					util.showLoading('删除中...');
					wx.request({
						url :app.globalData.serverUrl + '/userCompany/delSpecUserCompany',
						method:'delete',
						data :{id:cpyId,userId:userId},
						success : function(res){
							wx.hideLoading();
							if(res.data.code == 200){
								util.showToastSuc('删除成功');
								setTimeout(function(){
									_this.loadCompStaff();
								},1800);
							}else if(res.data.code == 1000){
								util.showToast('服务器错误');
							}else if(res.data.code == 50001){
								util.showToast('删除失败,当前员工不存在');
							}else if(res.data.code == 70001){
								util.showToast('抱歉,您暂无删除员工的权限');
							}
						}
					});
				}else if(res.cancel){}
			}
		})
	},
	loadCompDet : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/company/getSpecCompanyDetail',
			method:'get',
			data :{compId:_this.data.cpyId},
			success : function(res){
				wx.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						compInfoData : res.data.datas[0],
						originYyzzImg : res.data.datas[0].yyzzImg.replace('_small','')
					});
					for(var i=0;i<res.data.datas[0].zzImageList.length;i++){
						previewImgArr.push(app.globalData.serverUrl + '/' + res.data.datas[0].zzImageList[i].czImage.replace('_small',''));
					}
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无当前公司信息');
				}
			}
		});
	},
	previewYyzz : function(e){
		let src = e.currentTarget.dataset.src;
		wx.previewImage({
			current : src,
			urls : [src]
		});
	},
	previewDetImg : function(e){
		let index = e.currentTarget.dataset.index;
		wx.previewImage({
			current: previewImgArr[index],
			urls: previewImgArr
		})
	}
})