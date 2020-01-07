const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		rqTradeData : [],
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		isCanPubFlag : false,
		serverUrl: app.globalData.serverUrl
	},
	onLoad(){
		this.getRqTradeList();
	},
	onShow(){
		if(this.data.isCanPubFlag){
			this.setData({
				nowPage :1,
				loading : false,
				rqTradeData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.getRqTradeList(); 
		}
	},  
	onHide(){ 
		this.setData({
			isCanPubFlag : false
		});
	},
	getRqTradeList : function(){
		var _this = this;
		var field = {page:this.data.nowPage,limit:50,checkStatus:1,showStatus:0};
		this.setData({
			loading : true
		}); 
		let { nowPage,rqTradeData } = this.data;
		console.log(field)
		util.showLoading('数据加载中...')
		wx.request({ 
			url : app.globalData.serverUrl + '/gasTrade/getPageGasTradeList',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						rqTradeData.push( ...res.data.datas );
						_this.setData({ 
							rqTradeData,
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
				}else if(res.data.code == 10002){
					util.showToast('获取数据参数不能为空');
				}else if(res.data.code == 50001){
					//util.showToast('暂无燃气贸易记录');
					_this.setData({
						isHasDataFlag : false,
						loading : false
					});
				}else if(res.data.code == 70001){
					util.showToast('暂无权限查看燃气贸易记录');
				}
			}
		});
	},
	pubRqMy : function(){
		if(wx.getStorageSync('userId')){
			util.navigateTo('/pages/pubRqTrade/index?currPageType=addPub');
		}
	}
})