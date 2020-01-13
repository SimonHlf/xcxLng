const app = getApp();
const util = require('../../utils/util');
const WxParse = require('../../wxParse/wxParse.js');
Page({
	data:{
		newsId : '',
		isHasDataFlag : true,
		newsData : []
	},
	onLoad : function(options){
		this.setData({
			newsId : options.newsId
		});
		this.loadNewsDet();
	},
	loadNewsDet:function(){
		var field = {id:this.data.newsId},_this = this;
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/MsgCenter/getSpecMsgDetail',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						newsData : res.data.datas[0],
						isHasDataFlag : true,
					});
					WxParse.wxParse('article', 'html', res.data.datas[0].content, _this);
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
	}
})