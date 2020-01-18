const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		tabNav : [],
		currentTab : 0,
		currId : '',
		nowPage : 1,
		loading : false,
		compListData : []
	},
	onLoad(){
		this.getCompanyType();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			_this.loadCompList(_this.data.currId);
		}
	},
	getCompanyType : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url :app.globalData.serverUrl + '/comType/queryComType',
			method: 'get',
			data:{status:1},
			success : function(res){
				//console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						_this.setData({
							tabNav : res.data.datas,
							currId : res.data.datas[0].id,
							isHasDataFlag : true
						});
						_this.loadCompList(_this.data.currId);
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
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index,currSta = 0,
			id = e.currentTarget.dataset.id;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({
			currentTab : index,
			nowPage :1,
			loading : false,
			compListData : []
		});
		wx.pageScrollTo({
		  scrollTop: 0
		})
		this.loadCompList(id);
	},
	loadCompList : function(currId){
		var _this = this;
		var field = {typeId:currId,userId:wx.getStorageSync('userId'),page:_this.data.nowPage,limit:50};
		//console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,compListData } = this.data;
		wx.request({
			url :app.globalData.serverUrl + '/company/getPageCpyList',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				//console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						compListData.push( ...res.data.datas );
						_this.setData({ 
							compListData,
							nowPage,
							loading : false,
							isHasDataFlag : true
						});
					}else{ 
						_this.setData({
							loading : false
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
	},
	applyInComp : function(e){
		var id = e.currentTarget.dataset.id,
			cpyName = e.currentTarget.dataset.name,
			_this = this;
		var field = {userId:wx.getStorageSync('userId'),compId:id};
		//console.log(field)
		wx.showModal({
			title: '申请加入公司提示',
			content: '确定要申请加入'+ cpyName + '公司',
			success: function(res) {
				if(res.confirm) { 
					util.showLoading('处理中...');
					wx.request({
						url :app.globalData.serverUrl + '/userCompany/addUserCompany',
						method: 'post',
						data:field,
						header: {
						  'content-type': 'application/x-www-form-urlencoded',
						},
						success : function(res){
							//console.log(res)
							if(res.data.code == 200){
								util.showToast('申请成功,等待后台审核中...');
							}else if(res.data.code == 1000){
								util.showToast('服务器错误');
							}else if(res.data.code == 50001){
								util.showToast('当前公司不存在');
							}else if(res.data.code == 50003){
								util.showToast('当前公司已申请加入,等待后台审核中...');
							}
						} 
					});
				}else if(res.cancel){}
			}
		});
	}
})