// pages/lngHqDet/index.js
const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		gfId : '',
		specTjDate : ''
	},
	onLoad(options){
		/*this.setData({
			gfId : JSON.parse(options.currField).gfId,
			specTjDate : JSON.parse(options.currField).specTjDate
		});*/
		//this.loadLngHqDet();
	},
	loadLngHqDet : function(){
		var _this = this; 
		wx.request({
			url : app.globalData.serverUrl + '/lng/getReportLngPriceDate',
			data : {gfId:_this.data.gfId,specTjDate:_this.data.specTjDate},
			method: 'get',
			success:function(res){
				console.log(res)
			}
		});
	}
}) 