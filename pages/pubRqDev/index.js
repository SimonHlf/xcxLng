const app = getApp();
const util = require('../../utils/util');
var sourceType = '',upSuccDetImgArr = [],previewImgArr = [];
Page({
	data : {
		currPageType : '',
		cpyName : '',
		cpyId : '',
		headImg : '',
		succHeadImg : '',
		rqDevName : '',
		rqDevNo : '',
		scFacName : '',
		rqDevPrice : '',
		devLmName : '',
		devLmId : '',
		devLxName : '',
		devLxId : '',
		lxrName : '',
		lxrTel : '',
		upload_picture_list : [],
		remark : '',
		isHasUpLenFlag : false,
	},
	onLoad : function(options){
		this.setData({
			currPageType : options.currPageType
		});
	},
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addRqDevPage&cpyId=' + this.data.cpyId);
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
	getDevLm : function(){
		util.navigateTo('/pages/basic/getRqDevLmType/index?devLmId=' + this.data.devLmId + '&currPage=selectDevLm');
	},
	getDevLx : function(){
		util.navigateTo('/pages/basic/getRqDevLmType/index?devLxId=' + this.data.devLxId + '&currPage=selectDevLx');
	},
	formSubmit : function(e){
		let submitField = e.detail.value,
			regNum = /^\+?[1-9]\d*$/,
			regPhone = /^1\d{10}$/;
		this.setData({
			cpyName : submitField.cpyName,
			rqDevName : submitField.rqDevName,
			rqDevNo : submitField.rqDevNo,
			scFacName : submitField.scFacName, 
			rqDevPrice : submitField.rqDevPrice,
			devLmId : submitField.devLmId,
			devLxId : submitField.devLxId,
			lxrName : submitField.lxrName,
			lxrTel : submitField.lxrTel,
			remark : submitField.remark
		});
		if(wx.getStorageSync('userId')){
			if(this.data.cpyName == ''){
				util.showToast('请选择公司');
			}else if(this.data.headImg == ''){
				util.showToast('请上传燃气设备主图');
			}else if(this.data.rqDevName == ''){
				util.showToast('请输入设备名称');
			}else if(this.data.rqDevNo == ''){
				util.showToast('请输入设备型号');
			}else if(this.data.scFacName == ''){
				util.showToast('请输入生产厂家');
			}else if(this.data.rqDevPrice == ''){
				util.showToast('请输入设备价格');
			}else if(!regNum.test( this.data.rqDevPrice ) ){
				util.showToast('设备价格应是大于0的正整数');
			}else if(this.data.devLmId == ''){
				util.showToast('请选择设备类目');
			}else if(this.data.devLxId == ''){
				util.showToast('请选择设备类型');
			}else if(this.data.lxrName == ''){
				util.showToast('请输入联系人姓名');
			}else if(this.data.lxrTel == ''){
				util.showToast('请输入联系人手机号码');
			}else if(!regPhone.test( this.data.lxrTel ) && this.data.lxrTel.length != 11){
				util.showToast('手机号码格式不对，请重新填写');
			}else{
				var url = '',type = '',otherImg='',_this = this;
				if(upSuccDetImgArr.length > 0){ 
					otherImg = upSuccDetImgArr.join(',');
				} 
				var field = {userId:wx.getStorageSync('userId'),compId:this.data.cpyName,mainImg:this.data.succHeadImg,devName:this.data.rqDevName,devNo:this.data.rqDevNo,devPp:this.data.scFacName,
					devPrice:this.data.rqDevPrice,lmId:this.data.devLmId,zlId:this.data.devLxId,lxName:this.data.lxrName,lxTel:this.data.lxrTel,description:this.data.remark,detailImg:otherImg};
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/rqDevTrade/addRqDevTrade';
					type = 'post';
				}
				util.showLoading('发布中...');
				wx.request({
					url : url,
					method:type,
					data:field,
					header: {
					  'content-type': 'application/x-www-form-urlencoded',
					}, 
					success : function(res){
						util.hideLoading();
						if(res.data.code == 200){
							if(_this.data.currPageType == 'addPub'){
								util.showToast('发布燃气设备成功,等待后台审核中...');
								setTimeout(function(){
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2];
									prevPage.setData({
										isCanPubFlag : true
									});
									wx.navigateBack({
										delta:1
									})
								},1800);
							}
						}else if(res.data.code == 1000){
							util.showToast('服务器错误');
						}else if(res.data.code == 10002){
							util.showToast('发布燃气贸易参数不能为空');
						}else if(res.data.code == 70001){
							util.showToast('抱歉,您暂无权限发布燃气设备');
						}else if(json.code == 80001){
							util.showToast('当前燃气设备买卖信息审核已通过，暂不能修改');
						}
					}
				});
			}
		}
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
									succHeadImg: JSON.parse(res1.data).datas
								});
								console.log(that.data.succHeadImg)
							}
						}else if(JSON.parse(res1.data).code == 1000){
							util.showToast('服务器错误');
						}
					}
				})
			},
		})
	},
	uploadDetImg : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['从手机相册选择', '拍照'],
			success: function(res) {
				if(res.tapIndex == 0){
					sourceType = 'album';
				}else if(res.tapIndex == 1){
					sourceType = 'camera';
				}
				that.upMultiImg(sourceType);
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	upMultiImg : function(sourceType){
		let that = this; //获取上下文
		let upload_picture_list = that.data.upload_picture_list;
		let hasSelImgArr = [];
		    //选择图片
		    wx.chooseImage({
		      count: 9, // 默认9，这里显示一次选择相册的图片数量 
		      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有  
		      sourceType: [sourceType], // 可以指定来源是相册还是相机，默认二者都有
		      success: function (res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
		        let tempFiles = res.tempFiles
		        //把选择的图片 添加到集合里
		        for(let i in tempFiles) {
					tempFiles[i]['upload_percent'] = 0;
					upload_picture_list.push(tempFiles[i]);
					hasSelImgArr.push(tempFiles[i]);
					previewImgArr.push(tempFiles[i].path);
		        }
		        //显示 
		        that.setData({
					upload_picture_list: upload_picture_list,
		        });
				if(that.data.upload_picture_list.length >= 9){
					that.setData({
						isHasUpLenFlag : true
					});
				}
				that.uploadFile(hasSelImgArr);
			}
		})
	},
	uploadFile : function(hasSelImgArr){
		let page = this
		//循环把图片上传到服务器 并显示进度       
		for (let j in hasSelImgArr){
			if (hasSelImgArr[j]['upload_percent'] == 0){
				//上传图片后端地址
				page.upload_file_server(app.globalData.serverUrl + '/upload/uploadMuti', page, hasSelImgArr, j);
			}
		}
	},
	upload_file_server : function(url, that, upload_picture_list,j){
		//上传返回值
		const upload_task = wx.uploadFile({
		    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
		    filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
		    name: 'file',
		    formData: {
		      'num': j  
		    },
		    //附近数据，这里为路径     
		    success: function(res) {
				var data = JSON.parse(res.data);
				//字符串转化为JSON  
				if (data.code == 200) {
					var filename = data.datas[0]; //存储地址 显示
					upSuccDetImgArr.push(filename);
				}
		    } 
			
		});
	},
	previewImg : function(e){
		let index = e.currentTarget.dataset.index;
		wx.previewImage({
			//当前显示图片
			current: previewImgArr[index],
			//所有图片
			urls: previewImgArr
		})
	},
	delMultiImg : function(e){
		let upload_picture_list = this.data.upload_picture_list;
		let index = e.currentTarget.dataset.index;
		upload_picture_list.splice(index, 1);
		upSuccDetImgArr.splice(index,1);
		previewImgArr.splice(index,1);
		this.setData({
			upload_picture_list: upload_picture_list
		});
		if(this.data.upload_picture_list.length < 9){
			this.setData({
				isHasUpLenFlag : false
			});
		}
	}
})