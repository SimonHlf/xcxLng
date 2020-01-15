const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		isCanPubFlag : false,
		isAllEmptyFlag : false,
		serverUrl: app.globalData.serverUrl,
		nowPage : 1,
		isHasDataFlag : true,
		loading : false,
		qzListData : [],
		jzType : '',
		jzYear : '',
		wage : '' 
	},
	onLoad : function(){
		this.loadZpList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadZpList();
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	loadZpList : function(){
		var _this = this;
		var field = {jzYear:this.data.jzYear,jzType:this.data.jzType,wage:this.data.wage,page:this.data.nowPage,limit:50,checkSta:1,showSta:0};
		this.setData({
			loading : true
		}); 
		let { nowPage,qzListData } = this.data;
		util.showLoading('数据加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/driverZp/queryDriverZp',
			method:'get',
			data : field,
			success : function(res){  
				wx.hideLoading(); 
				console.log(res)
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						qzListData.push( ...res.data.datas );
						_this.setData({ 
							qzListData,
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
	pubZpInfo : function(){
		util.navigateTo('/pages/pubDriverZp/index?currPageType=addPub');
	},
	onShow(){
		if(this.data.jzType != '' || this.data.jzYear != '' || this.data.wage != '' || this.data.isAllEmptyFlag){
			this.setData({
				nowPage :1,
				loading : false,
				qzListData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadZpList(); 
		}
	},
	goFilter : function(){
		util.navigateTo('/pages/driverQz/filter?jzType=' + this.data.jzType + '&jzYear=' + this.data.jzYear + '&wage=' + this.data.wage);
	},
	getZpDet : function(e){
		var id = e.currentTarget.dataset.id;
		util.navigateTo('/pages/driverZpDet/index?id=' + id);
	}
})