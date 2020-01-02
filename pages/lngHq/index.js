// pages/lngHq/index.js
const app = getApp();
const util = require('../../utils/util');
var date = new Date(),nowPage = 1;
var currDate = date.getFullYear() + "-" + util.appendZero( (date.getMonth() + 1) ) + "-" + util.appendZero( date.getDate() );
Page({
	data : {
		nowDate : currDate,
		selectDate : '' ,
		lngData : [],
		today : '',
		yesterday:  '',
		tomorrow : ''
	},
	onLoad(){ 
		this.loadLngData();
	},
	loadLngData : function(){
		var _this = this;
		util.showLoading('加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/lng/getPageLngPriceData',
			method: 'get',
			data:{priceDate:_this.data.selectDate,page:nowPage,limit:50},
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					_this.setData({
						lngData : res.data.datas[0],
						today : res.data.datas[0].dateTitle.split(':')[1],
						yesterday : res.data.datas[0].dateTitle.split(':')[0],
						tomorrow : res.data.datas[0].dateTitle.split(':')[2]
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无数据');
				}else if(res.data.code == 70001){
					util.showToast('暂无权限访问lng行情记录');
				}
				
			}
		});
	},
	bindDateChange : function(e){
		this.setData({
			nowDate : e.detail.value,
			selectDate : e.detail.value
		});
	}
})