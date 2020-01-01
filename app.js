//app.js
App({
  onLaunch: function () {
    
  },
  globalData: {
	serverUrl : 'http://192.168.1.3:8080',
    userInfo: null,
	isAuthor:false,//是否已授权
	wxInfo:null,//用户微信信息
	sessionInfo:null,//用户sessionkey&openid
  }
})