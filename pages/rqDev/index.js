const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		rqDevData : [],
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		isCanPubFlag : false,
		lmId : '',
		lxId : '',
		serverUrl: app.globalData.serverUrl,
		isAllEmptyFlag : false
	},
	onLoad : function(){
		this.loadRqDevList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadRqDevList();
		}
	},
	onShow(){
		if(this.data.lmId != '' || this.data.lxId != '' || this.data.isAllEmptyFlag){//从最新发布页面返回过来并且已经发布
			this.setData({
				nowPage :1,
				loading : false,
				rqDevData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadRqDevList(); 
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	getRqDevDet : function(e){
		let rqDevId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/rqDev/rqDevDet?rqDevId=' + rqDevId);
	},
	goFilter : function(){
		util.navigateTo('/pages/rqDev/filter?lmId=' + this.data.lmId + '&lxId=' + this.data.lxId);
	},
	loadRqDevList : function(){
		var _this = this;
		var field = {lmId:this.data.lmId,zlId:this.data.lxId,page:this.data.nowPage,limit:50,checkSta:1,showSta:0};
		//console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,rqDevData } = this.data;
		util.showLoading('数据加载中...')
		wx.request({ 
			url : app.globalData.serverUrl + '/rqDevTrade/queryRqDevTrade',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				//console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						rqDevData.push( ...res.data.datas );
						_this.setData({ 
							rqDevData,
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
				}else if(res.data.code == 50001){
					_this.setData({
						isHasDataFlag : false,
						loading : false
						
					});
				}
			}
		});
	},
	pubRqDev : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/pubRqDev/index?currPageType=addPub');
		}
	}
})