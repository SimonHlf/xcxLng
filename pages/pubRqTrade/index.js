const app = getApp();
const util = require('../../utils/util');
var sourceType = '';
Page({
	data:{
		cpyName : '',
		cpyId:'',
		lqFacName : '',
		lqFacId : '',
		lqTypeName : '',
		lqTypeId : '',
		headImg : '',
		succHeadImg : '',
		notUpLoadHeadImg : true,
		psAreaName:'',
		provOrderNo : '',
		zcriq : '请选择装车日期',
		bgImg : '',
		qfImg1 : '',
		qfImg2 : '',
		qfImg3 : '',
		whpImg : '',
		clImg :　'',
		isSelDate : false,
		isSelPsArea : false
	},
	onShow : function(){
	},
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addRqTradePage&cpyId=' + this.data.cpyId);
	},
	getLqFac : function(){
		if(this.data.cpyId == ''){
			util.showToast('请先选择公司');
			return;
		}
		util.navigateTo('/pages/basic/getLqFactory/index?cpyId=' + this.data.cpyId + '&lqFacId=' + this.data.lqFacId);
	},
	uploadMainImg : function(){
		var that = this;
		if(this.data.lqFacId == ''){
			util.showToast('请先选择液厂');
			return;
		}
		wx.showActionSheet({
			itemList: ['从手机相册选择', '拍照'],
			success: function(res) {
				console.log(res.tapIndex)
				if(res.tapIndex == 0){
					sourceType = 'album';
				}else if(res.tapIndex == 1){
					sourceType = 'camera';
				}
				that.upLoadHeadImg(sourceType);
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	upLoadHeadImg : function(sourceType){
		var that = this;
		wx.chooseImage({
			count:1,
			sizeType: ['original'],
			sourceType: [sourceType],// 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;  
				that.setData({
				  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				  headImg: tempFilePaths[0]
				});
				wx.showToast({
					title: '正在上传...',
					icon: 'loading',
					mask: true
			    })
				wx.uploadFile({
					url: app.globalData.serverUrl + '/upload/uploadSingle',
					filePath: that.data.headImg,
					name: 'file', 
					success:function(res1){
						wx.hideToast();
						if(JSON.parse(res1.data).code == 200){
							that.setData({
								succHeadImg: JSON.parse(res1.data).datas
							});
							console.log(that.data.succHeadImg)
						}else if(JSON.parse(res1.data).code == 1000){
							util.showToast('服务器错误');
						}
					}
				})
			},
		})
	},
	bindDateChange : function(e){
		this.setData({
			zcriq : e.detail.value,
			isSelDate : true
		});
	},
	selPsArea : function(){
		util.navigateTo('/pages/basic/getPsArea/index?provOrderNo=' + this.data.provOrderNo);
	}
})