const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		msgVal : '',
		currPosPage : '',
		msgId : ''
	},
	onLoad : function(options){
		console.log(options)
		this.setData({
			currPosPage : options.currBackPage
		});
		if(this.data.currPosPage == 'msgDetList' ||　this.data.currPosPage == 'msgDetBtn'){
			this.setData({
				msgId : options.msgId
			});
		}
	},
	formSubmit : function(e){
		var _this = this,url = '',field = null;
		this.setData({
			msgVal : e.detail.value.msgTxtarea
		}); 
		if(wx.getStorageSync('userId')){
			if(this.data.msgVal == ''){
				util.showToast('请输入要留言的内容');
				return;
			}
			if(this.data.currPosPage == 'mainMsgList'){
				field = {content:this.data.msgVal,userId:wx.getStorageSync('userId')};
				url = app.globalData.serverUrl + '/lngMsg/addLngMsg';
			}else if(this.data.currPosPage == 'msgDetList' || this.data.currPosPage == 'msgDetBtn'){
				field = {msgId:this.data.msgId,content:this.data.msgVal,userId:wx.getStorageSync('userId')};
				url = app.globalData.serverUrl + '/lngMsg/addLngMsgRep';
			}
			//console.log(field)
			wx.request({  
				url : url,
				method:'post',
				data :field,
				header: {
				  'content-type': 'application/x-www-form-urlencoded',
				},
				success : function(res){
					if(res.data.code == 200){
						util.showToastSuc('留言成功');
						setTimeout(function(){
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							if(_this.data.currPosPage == 'mainMsgList'){
								prevPage.setData({
									currBackPage: _this.data.currPosPage
								})
								wx.navigateBack({
									delta:1
								})
							}else if(_this.data.currPosPage == 'msgDetList'){
								prevPage.setData({
									currBackPage: _this.data.currPosPage
								})
								util.redirectTo('/pages/lngHqMsg/lngHqMsgDet?msgId=' + _this.data.msgId);
							}else if(_this.data.currPosPage == 'msgDetBtn'){//通过我要回复按钮进来
								prevPage.setData({
									isReplyFlag : true
								})
								wx.navigateBack({
									delta:1
								})
							}
						},1200); 
					}else if(res.data.code == 1000){
						util.showToast('服务器错误');
					}
				}
			});
		}
	}
})