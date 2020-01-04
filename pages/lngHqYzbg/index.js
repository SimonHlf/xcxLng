const app = getApp();
const util = require('../../utils/util');
const newYzImg = [],bigImgArr = [];
Page({
	data : {
		gfId : '',
		yzbgImg:[],
		isHasDataFlag : false
	},
	onLoad(options){
		this.setData({
			gfId : options.gfId
		});
		this.loadYzBgImgList();
	},
	loadYzBgImgList : function(){
		var _this = this;
		wx.request({
			url : app.globalData.serverUrl + '/lng/getSpecGasFactoryZzImg',
			method:'get',
			data : {gfId:_this.data.gfId},
			success : function(res){
				//console.log(res)
				if(res.data.code == 200){
					for(var attr in res.data.datas){
						newYzImg[attr] = app.globalData.serverUrl + '/' + res.data.datas[attr].imgPath;
					}
					_this.setData({
						yzbgImg : newYzImg,
						isHasDataFlag : true
					});
					for(var i=0;i<_this.data.yzbgImg.length;i++){
						bigImgArr.push(_this.data.yzbgImg[i].replace('_small',''));
					}
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 10002){
					util.showToast('获取数据参数不能为空');
				}else if(res.data.code == 50001){
					//util.showToast('当前液厂液质报告图不存在');
				}
			}
		});
	},
	viewBigImg : function(e){
		var currImg = e.currentTarget.dataset.img.replace('_small','');
		wx.previewImage({
			current : currImg,
			urls : bigImgArr
		});
	}
	
})