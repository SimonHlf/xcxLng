const app = getApp();
const util = require('../../utils/util');
Page({
	pubZpInfo : function(){
		util.navigateTo('/pages/pubDriverZp/index?currPageType=addPub');
	}
})