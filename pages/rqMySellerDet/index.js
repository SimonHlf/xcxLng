const app = getApp();
const util = require('../../utils/util');
const psAreaData = [],previewImgArr = [];
Page({
	data:{
		canByGasFlag : true,
		isShowLayerFlag : true,
		tradeId : '',
		tradeDetData : [],
		psArea : '',
		serverUrl: app.globalData.serverUrl,
		originHeadImg : '',
		clOriginImg : '',
		whpOriginImg : '',
		userFocus : false,
		ufId : '',
		isHasDataFlag : true
	},
	onLoad(options){
		this.setData({
			tradeId : options.tradeId
		});
		this.loadMyTradeDet();
	},
	previewFun : function(src){
		wx.previewImage({
			current : src,
			urls : [src]
		});
	},
	previewHeadImg : function(e){
		let src = e.currentTarget.dataset.src;
		this.previewFun(src);
	},
	previewClImg : function(e){
		let src = e.currentTarget.dataset.src;
		this.previewFun(src);
	},
	previewWhpImg : function(e){
		let src = e.currentTarget.dataset.src;
		this.previewFun(src);
	},
	previewDetImg : function(e){
		let index = e.currentTarget.dataset.index;
		wx.previewImage({
			current: previewImgArr[index],
			urls: previewImgArr
		})
	},
	loadMyTradeDet : function(){
		var _this = this;
		var field = {gasTradeId:this.data.tradeId,opt:1,userId:wx.getStorageSync('userId')};
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/gasTrade/getSpecGasTradeDetail',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						tradeDetData : res.data.datas[0],
						isHasDataFlag : true,
						originHeadImg : res.data.datas[0].headImg.replace('_small',''),
						clOriginImg :  res.data.datas[0].tructsImg.replace('_small',''),
						whpOriginImg : res.data.datas[0].whpImg.replace('_small',''),
						userFocus : res.data.datas[0].userFocus,
						ufId : res.data.datas[0].ufId
					});
					for(var i=0;i<_this.data.tradeDetData.psArea.length;i++){
						if(_this.data.tradeDetData.psArea[i].selFlag){
							psAreaData.push(_this.data.tradeDetData.psArea[i].provName);
						}
					}
					if(_this.data.tradeDetData.otherImgList.length > 0){
						var otherImgList = _this.data.tradeDetData.otherImgList;
						for(let i in otherImgList) {
							previewImgArr.push(app.globalData.serverUrl + '/' + otherImgList[i].gtiImg.replace('_small',''));
						}
					}
					_this.setData({
						psArea:psAreaData.join('/')
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
					_this.setData({
						isHasDataFlag : false
					});
				}else if(res.data.code == 10002){
					util.showToast('获取燃气贸易详情参数不能为空');
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
	getPhoneCall : function(e){
		let tel = e.currentTarget.dataset.phone;
		wx.makePhoneCall({
			phoneNumber : tel
		})
	},
	getFocus : function(){
		var _this = this; 
		if(wx.getStorageSync('userId')){
			util.showLoading('关注中...');
			var field = {userId:wx.getStorageSync('userId'),focusId:this.data.tradeId,focusType:'rqmm'};
			console.log(field)
			wx.request({
				url : app.globalData.serverUrl + '/userCompany/addUserFocus',
				method: 'post',
				header: {
				  'content-type': 'application/x-www-form-urlencoded',
				},
				data : field, 
				success:function(res){
					util.hideLoading(); 
					if(res.data.code == 200){
						util.showToastSuc('关注成功');
						_this.setData({
							userFocus : true ,
							ufId : res.data.datas
						});
					}else if(res.data.code == 1000){
						util.showToast('服务器错误');
					}else if(res.data.code == 50003){
						util.showToast('当前已关注,不能重复关注');
					}
				}
			});
		}
	},
	cancelFocus : function(){
		var _this = this;
		if(wx.getStorageSync('userId')){
			util.showLoading('取消关注中...');
			var field = {ufId:this.data.ufId};
			console.log(field)
			wx.request({
				url : app.globalData.serverUrl + '/userCompany/delUserFocusById',
				method: 'delete',
				header: {
				  'content-type': 'application/x-www-form-urlencoded',
				},
				data : field,
				success:function(res){
					util.hideLoading();
					if(res.data.code == 200){
						util.showToastSuc('取消关注成功');
						_this.setData({
							userFocus : false,
							ufId : ''
						});
					}else if(res.data.code == 1000){
						util.showToast('服务器错误');
					}else if(res.data.code == 50002){
						util.showToast('当前数据错误,暂不能操作');
					}
				}
			});
		}
	}
})