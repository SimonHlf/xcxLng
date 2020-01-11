const app = getApp();
const util = require('../../utils/util');
var sourceType = '';
Page({
	data:{
		headImg : '',
		headImgSucc : '',
		birth : '',
		workTime : '',
		sexArr : ['男','女'],
		marrayArr : ['未婚','已婚'],
		jzTypeArr : ["A1","A2","A3","B1","B2","C1","C2","C3","C4","D","E","F","M","N","P"],
		degreeArr : ['初中','中专/中技','高中','大专','本科','硕士','博士'],
		workXingzhiArr : ['兼职','全职'],
		isMarried : '是否已婚',
		sex : '请选择性别',
		jzType : '请选择驾照类型',
		degree : '请选择学历',
		gzxz : '请选择求职意向',
		isSelMarray : false,
		isSelSex : false,
		isSelJzType : false,
		isSelDegree : false,
		isSelWorkXz : false,
		provName : '',
		cityName : ''
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
	},
	bindSexPicker : function(e){
		var _this = this;
		this.setData({
			sex : _this.data.sexArr[e.detail.value],
			isSelSex : true
		});
	},
	bindMarrayPicker : function(e){
		var _this = this;
		this.setData({
			isMarried : _this.data.marrayArr[e.detail.value],
			isSelMarray : true
		});
	},
	bindJzTypePicker : function(e){
		var _this = this;
		this.setData({
			jzType : _this.data.jzTypeArr[e.detail.value],
			isSelJzType : true
		});
	},
	bindDegreePicker : function(e){
		var _this = this;
		this.setData({
			degree : _this.data.degreeArr[e.detail.value],
			isSelDegree : true
		});
	},
	bindWorkXzPicker : function(e){
		var _this = this;
		this.setData({
			gzxz : _this.data.workXingzhiArr[e.detail.value],
			isSelWorkXz : true
		});
	},
	uploadMainImg : function(){
		this.selectUploadType('upHeadImg');
	},
	selectUploadType : function(upOpt){
		var that = this;
		wx.showActionSheet({
			itemList: ['从手机相册选择', '拍照'],
			success: function(res) {
				if(res.tapIndex == 0){
					sourceType = 'album';
				}else if(res.tapIndex == 1){
					sourceType = 'camera';
				}
				that.upLoadSingleImg(sourceType,upOpt);
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	upLoadSingleImg : function(sourceType,upOpt){
		var that = this,chooseImgSrc='',serverUrl = app.globalData.serverUrl;
		wx.chooseImage({
			count:1,
			sizeType: ['original'],
			sourceType: [sourceType],// 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;  
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				if(upOpt == 'upHeadImg'){
					that.setData({
						headImg: tempFilePaths[0]
					});			  
				} 
				chooseImgSrc = tempFilePaths[0];
				wx.showToast({
					title: '正在上传...',
					icon: 'loading',
					mask: true
			    })
				wx.uploadFile({
					url: app.globalData.serverUrl + '/upload/uploadSingle',
					filePath: chooseImgSrc,
					name: 'file', 
					success:function(res1){
						wx.hideToast();
						if(JSON.parse(res1.data).code == 200){
							if(upOpt == 'upHeadImg'){
								that.setData({
									headImgSucc: JSON.parse(res1.data).datas
								});
							}
						}else if(JSON.parse(res1.data).code == 1000){
							util.showToast('服务器错误');
						}
					}
				})
			},
		})
	}
})