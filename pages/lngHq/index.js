// pages/lngHq/index.js
var date = new Date();
var currDate = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
Page({
	data : {
		nowDate : currDate
	},
	bindDateChange : function(e){
		this.setData({
			nowDate : e.detail.value
		});
	}
})