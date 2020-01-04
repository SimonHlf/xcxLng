const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		msgId : '',
		nowPage : 1,
		mainList : [],
		msgDetList : [],
		loading:false
	}, 
	onLoad : function(options){
		this.setData({
			msgId : options.msgId
		});
		this.loadMsgDetList();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadMsgDetList();
		}
	},
	loadMsgDetList : function(){
		let _this = this,
			field = {msgId:this.data.msgId,page:this.data.nowPage,limit:15};
		let { nowPage,msgDetList } = this.data;
		this.setData({
			loading : true
		}); 
		wx.request({
			url : app.globalData.serverUrl + '/lngMsg/getLngMsgRepPageList',
			method:'get',
			data :field,
			success : function(res){
				console.log(res) 
				if(res.data.code == 200){
					_this.setData({
						mainList : res.data.datas[0].mainList[0],
					});
					if(res.data.datas[0].replyList.length > 0){
						nowPage += 1;
						msgDetList.push( ...res.data.datas[0].replyList );
						_this.setData({
							msgDetList,
							nowPage,
							loading : false
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
				}
			}
		});
	}
})