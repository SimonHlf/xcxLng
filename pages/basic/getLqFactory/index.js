const app = getApp();
const util = require('../../../utils/util');
var cpyId = '',lqFacId = '';
Page({
	data : {
		state:-1,
		lqTypeData:[],
		isHasDataFlag : true
	},
	onLoad : function(options){
		cpyId = options.cpyId;
		lqFacId = options.lqFacId;
		this.getCpyList();
	},
	getCpyList : function(){
		var _this = this,
			field = {cpyId:cpyId};
		util.showLoading('加载中...')
		wx.request({
			url : app.globalData.serverUrl + '/gsf/getGasFactoryList',
			method: 'get',
			data:field,
			success : function(res){
				util.hideLoading();
				if(res.data.code == 200){
					if(lqFacId != ''){//之前已经选择对应公司 进行匹配
						for(var i=0;i<res.data.datas.length;i++){
							if(res.data.datas[i].gfId == lqFacId){
								_this.setData({
									state : i
								});
							}
						}
					}
					_this.setData({
						lqTypeData : res.data.datas
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
	selectLqType : function(e){
		var name = e.currentTarget.dataset.name,
			id = e.currentTarget.dataset.id,
			lqTypeId = e.currentTarget.dataset.lqtypeid,
			lqTypeName = e.currentTarget.dataset.lqtypename,
			headImg = e.currentTarget.dataset.headimg;
		this.setData({
			state:e.currentTarget.dataset.key
		});
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			lqFacName : name,
			lqFacId : id,
			lqTypeName : lqTypeName,
			lqTypeId : lqTypeId,
			headImg : app.globalData.serverUrl + '/' + headImg,
			notUpLoadHeadImg : false
		});
		wx.navigateBack({
			delta:1
		})
	}
})