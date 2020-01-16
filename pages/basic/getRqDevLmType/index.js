const app = getApp();
const util = require('../../../utils/util');
var devLmId = '',devLxId = '',currPage = '';
Page({
	data : {
		state:-1,
		rqDevLmData:[],
		isHasDataFlag : true,
		currTitle : ''
	},
	onLoad : function(options){
		currPage = options.currPage;
		if(currPage == 'selectDevLm'){
			devLmId = options.devLmId;
			this.setData({
				currTitle : '燃气设备类目'
			});
		}else{
			devLxId = options.devLxId;
			this.setData({
				currTitle : '燃气设备类型'
			});
		}
		this.getRqDevLmList();
	},
	getRqDevLmList : function(){
		var _this = this,
			field = {id:''},url = '';
		util.showLoading('加载中...');
		if(currPage == 'selectDevLm'){
			url = app.globalData.serverUrl + '/rqDevType/queryRqDevType';
		}else{
			url = app.globalData.serverUrl + '/rqType/queryRqType';
		}
		wx.request({
			url :url,
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					if(currPage == 'selectDevLm'){
						if(devLmId != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].id == devLmId){
									_this.setData({
										state : i
									});
								}
							}
						}
					}else{
						if(devLxId != ''){//之前已经选择对应公司 进行匹配
							for(var i=0;i<res.data.datas.length;i++){
								if(res.data.datas[i].id == devLxId){
									_this.setData({
										state : i
									});
								}
							}
						}
					}
					_this.setData({
						rqDevLmData : res.data.datas,
						isHasDataFlag : true
					});
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
	},
	selectLm : function(e){
		var id = e.currentTarget.dataset.id,
			name = e.currentTarget.dataset.name;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(currPage == 'selectDevLm'){
			prevPage.setData({
				devLmName : name,
				devLmId : id
			});
		}else{
			prevPage.setData({
				devLxName : name,
				devLxId : id
			});
		}
		wx.navigateBack({
			delta:1
		})
	}
})