const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
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
		this.loadQzList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadQzList();
		}
	},
	onHide(){
		this.setData({
			isCanPubFlag : false,
			isAllEmptyFlag : false
		});
	},
	loadQzList : function(){
		var _this = this;
		var field = {jzYear:this.data.jzYear,jzType:this.data.jzType,wage:this.data.wage,page:this.data.nowPage,limit:50,checkSta:1,showSta:0};
		console.log(field)
		this.setData({
			loading : true
		}); 
		let { nowPage,qzListData } = this.data;
		util.showLoading('数据加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/driverZp/queryDriverQz',
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
	pubDriverQz : function(){
		wx.showLoading();
		wx.request({
			url : app.globalData.serverUrl + '/driverZp/getPubNum',
			method:'get',
			data:{userId:wx.getStorageSync('userId'),opt:0},
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			}, 
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					util.navigateTo('/pages/pubDriverQz/index?currPageType=addPub');
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 10002){
					util.showToast('获取发布求职数量参数不能为空');
				}else if(res.data.code == 50005){
					util.showToast('当前发布求职简历最多只能发布一条');
				}
			}
		});
		
	},
	onShow(){
		if(this.data.jzType != '' || this.data.jzYear != '' || this.data.wage != '' || this.data.isAllEmptyFlag){//从最新发布页面返回过来并且已经发布
			this.setData({
				nowPage :1,
				loading : false,
				qzListData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadQzList(); 
		}
	},
	goFilter : function(){
		util.navigateTo('/pages/driverQz/filter?jzType=' + this.data.jzType + '&jzYear=' + this.data.jzYear + '&wage=' + this.data.wage);
	},
})