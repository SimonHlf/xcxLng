const app = getApp();
const util = require('../../utils/util');
Page({
	data:{
		headImg : '',
		headImgSucc : '',
		birth : '',
		workTime : ''
	},
	bindDateChange_birth : function(e){
		this.setData({
			birth : e.detail.value
		});
	},
	bindDateChange_work : function(e){
		this.setData({
			workTime : e.detail.value
		});
	}
})