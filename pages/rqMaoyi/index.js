const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		rqTradeData : [],
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		isCanPubFlag : false,
		isAllEmptyFlag : false,
		serverUrl: app.globalData.serverUrl,
		gasTypeId : '',
		psArea : '',
		sPrice : '',
		ePrice : '',
		provOrderNo : ''
	},
	onLoad(){
		this.getRqTradeList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.getRqTradeList();
		}
	},
	// onPullDownRefresh : function(){
	// 	this.setData({
	// 		isPullDownFlag : true
	// 	});
	// 	wx.showNavigationBarLoading();
	// 	//this.getRqTradeList();
	// },
	onShow(){
		if(this.data.psArea != '' || this.data.gasTypeId != '' || this.data.isAllEmptyFlag || this.data.sPrice !== '' || this.data.ePrice != '' || this.data.isCanPubFlag){//从最新发布页面返回过来并且已经发布
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
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	getRqTradeList : function(){
		var _this = this;
		var field = {gasTypeId:this.data.gasTypeId,psArea:this.data.psArea,sPrice:this.data.sPrice,ePrice:this.data.ePrice,page:this.data.nowPage,limit:50,checkStatus:1,showStatus:0};
		console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,rqTradeData } = this.data;
		wx.showNac
		util.showLoading('数据加载中...');
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
	},
	goFilter : function(){
		util.navigateTo('/pages/rqMaoyi/filter?provOrderNo=' + this.data.provOrderNo + '&gtId=' + this.data.gasTypeId);
	},
	getMyDet : function(e){
		let tradeId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/rqMySellerDet/index?tradeId=' + tradeId);
	}
})