const app = getApp();
const util = require('../../utils/util');
var replyLikeArr = [];
Page({
	data:{
		nowPage : 1,
		lngMsgData : [],
		isHasDataFlag : true,
		loading : false ,
		currBackPage : '',
		replyLike : [],
		replyNum : 0,
		canLoadFlag : false
	},
	onLoad(options){
		replyLikeArr = this.data.replyLike;
		this.loadLngMsgList();
	},
	onShow : function(){
		if(this.data.currBackPage == 'mainMsgList' || this.data.currBackPage == 'msgDetList' || this.data.canLoadFlag){
			//从留言列表点击我要留言按钮到留言页面再返回
			this.setData({
				nowPage : 1,
				loading : false,
				lngMsgData : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadLngMsgList();
		}
	},
	onHide : function(){
		this.setData({
			currBackPage : '',
			canLoadFlag : false
		});
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadLngMsgList();
		}
	}, 
	loadLngMsgList : function(){
		var _this = this; 
		let { nowPage,lngMsgData } = this.data;
		let field = {page:_this.data.nowPage,limit:50};
		this.setData({
			loading : true
		}); 
		wx.request({
			url : app.globalData.serverUrl + '/lngMsg/getLngMsgPageList',
			method:'get',
			data :field,
			success : function(res){
				if(res.data.code == 200){
					if(res.data.datas.length > 0){
						nowPage += 1;
						lngMsgData.push( ...res.data.datas );
						_this.setData({
							lngMsgData,
							nowPage,
							loading : false
						});
						replyLikeArr.length = 0;
						for(var i=0;i<res.data.datas.length;i++){
							replyLikeArr.push(res.data.datas[i].zcTimes);
						}
						_this.setData({
							replyLike : replyLikeArr
						});
					}else{
						_this.setData({
							loading : false
						});
					}
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					//util.showToast('当前液厂液质报告图不存在');
					_this.setData({
						isHasDataFlag : false
					});
				}
			}
		});
	},
	viewReplyDet : function(e){
		let msgId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/lngHqMsg/lngHqMsgDet?msgId=' + msgId);
	},
	addLngMsg : function(){
		util.navigateTo('/pages/lngHqMsg/leaveMsg?currBackPage=mainMsgList');
	},
	addLngMsgDet : function(e){
		let msgId = e.currentTarget.dataset.id;
		util.navigateTo('/pages/lngHqMsg/leaveMsg?currBackPage=msgDetList&msgId=' + msgId);
	}, 
	dianzan : function(e){
		var _this = this,msgId = e.currentTarget.dataset.id,
			index = e.currentTarget.dataset.index,
			field = {msgId : msgId,userId:wx.getStorageSync('userId')},
			replyLikeArr = this.data.replyLike;
		util.showLoading('点赞中...');
		wx.request({
			url : app.globalData.serverUrl + '/lngMsg/addLmZc',
			method:'post',
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			}, 
			data :field,
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					util.showToastSuc('点赞成功');
					replyLikeArr[index] = parseInt(replyLikeArr[index]) + 1  //当前对象的原始值 +1
					_this.setData({
						replyLike: replyLikeArr
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50003){
					util.showToast('您当天已点过赞,不能重复点赞');
				}
			}
		});
	}
})