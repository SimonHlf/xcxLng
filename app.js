//app.js
App({
  onLaunch: function () {
    
  },
  globalData: { 
    //serverUrl: 'http://192.168.43.224:8081',
	serverUrl : 'http://192.168.1.6:8888',
	//serverUrl : 'http://192.168.3.26:8081',
    userInfo: null,
	isAuthor:false,//是否已授权
	regPhone : /^[1][3,4,5,7,8][0-9]{9}$/
  }
}) 