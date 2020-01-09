const app = getApp();
const util = require('../../utils/util');
var sourceType = '',upSuccDetImgArr = [],previewImgArr = [];
Page({
	data : {
		priceTit : '',
		tradeTypeName : '', 
		tradeTypeId : '',
		compTypeName : '',
		compTypeId : '',
		truckTypeName : '',
		truckTypeId : '',
		carType : '',
		carTypeName : '',
		carTypeId : '',
		cpyName : '',
		cpyId : '',
		headImg : '',
		succHeadImg : '',
		provName : '',
		cityName : '',
		gznf : '请选择购置年份',
		ctspny : '请选择车头上牌年月',
		trucksPrice : '',
		ctTypeName : '',
		ctTypeId : '',
		ctPpId : '',
		ctPpName : '',
		potBandName : '',
		potBandId : '',
		jgzzName : '',
		jgzzId : '',
		volume : '',
		cgspny : '请选择储罐上牌年月',
		distance : '',
		accIdentName : '',
		accIdentId : '',
		lxrName : '',
		lxrTel : '',
		psAreaName : '',
		provOrderNo : '',
		wqpfbzName : '',
		wqpfbzId : '',
		gasTypeName : '',
		gasTypeId : '',
		ctImg : '',
		ctImgSucc : '',
		gcxxzImg : '',
		gcxxzImgSucc : '',
		clyyzImg : '',
		clyyzImgSucc : '',
		jyhgzImg : '',
		jyhgzImgSucc : '',
		aqfBgImg : '',
		aqfBgImgSucc : '',
		upload_picture_list : [],
		remark : '',
		isSelPsArea : false,
		notUpLoadHeadImg : true,
		isHasUpLenFlag : false,
		isSelDate_year : false,
		isSelDate_month : false,
		isSelDate_month_pt : false,
		isZlFlag : false,
		isDangerFlag : false,
	},
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addRqDevPage&cpyId=' + this.data.cpyId);
	},
	uploadMainImg : function(){
		this.selectUploadType('upHeadImg');
	},
	selIsHasAccident : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['不公开', '是','否'],
			success: function(res) {
				if(res.tapIndex == 0){
					that.setData({
						accIdentName : '不公开',
						accIdentId : 0
					});
				}else if(res.tapIndex == 1){
					that.setData({
						accIdentName : '是',
						accIdentId : 1
					});
				}else if(res.tapIndex == 2){
					that.setData({
						accIdentName : '否',
						accIdentId : 2
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	getTradeType : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['租赁', '买卖'],
			success: function(res) {
				if(res.tapIndex == 0){
					that.setData({
						tradeTypeName : '租赁',
						tradeTypeId : 1,
						isZlFlag : true,
						priceTit : '租赁'
					});
				}else if(res.tapIndex == 1){
					that.setData({
						tradeTypeName : '买卖',
						priceTit : '买卖',
						tradeTypeId : 2,
						isZlFlag : false,
						isSelPsArea : false,
						jgzzName : '',
						jgzzId : '',
						psAreaName : '',
						provOrderNo : ''
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	getCompType : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['个人', '公司'],
			success: function(res) {
				if(res.tapIndex == 0){
					that.setData({
						compTypeName : '个人',
						compTypeId : 1,
						carType : '',
						truckTypeName : '',
						truckTypeId : '',
						carTypeId : '',
						carTypeName : '',
						cpyName : '',
						cpyId : ''
					}); 
				}else if(res.tapIndex == 1){
					that.setData({
						compTypeName : '公司',
						compTypeId : 2,
						carType : '',
						truckTypeName : '',
						truckTypeId : '',
						carTypeId : '',
						carTypeName : ''
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	getTrucksType : function(){
		var itemList = [],that = this;
		if(this.data.compTypeId == ''){
			util.showToast('请先选择企业类型');
			return;
		}
		if(this.data.compTypeId == 1){
			itemList = ['普货'];
		}else if(this.data.compTypeId == 2){
			itemList = ['普货','危货'];
		}
		wx.showActionSheet({
			itemList: itemList,
			success: function(res) {
				if(res.tapIndex == 0){
					that.setData({
						carType : '普货',
						truckTypeName : '普货',
						truckTypeId : 1,
						carTypeId : '',
						carTypeName : '',
						isDangerFlag : false,
						potBandName : '',
						potBandId : '',
						volume : '',
						isSelDate_month_pt : false,
						cgspny : '请选择储罐上牌年月',
						gasTypeName : '',
						gasTypeId : '',
						ctImg : '',
						ctImgSucc : '',
						gcxxzImg : '',
						gcxxzImgSucc : '',
						clyyzImg : '',
						clyyzImgSucc : '',
						jyhgzImg : '',
						jyhgzImgSucc : '',
						aqfBgImg : '',
						aqfBgImgSucc : ''
					});
				}else if(res.tapIndex == 1){
					that.setData({
						carType : '危货',
						truckTypeName : '危货',
						truckTypeId : 2,
						carTypeId : '',
						carTypeName : '',
						isDangerFlag : true
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	selectCity : function(e){
		this.setData({
			provName : e.detail.province,
			cityName :e.detail.city
		}); 
	},
	formSubmit : function(e){
		let submitField = e.detail.value,
			regNum = /^(0|[1-9][0-9]*)$/,
			regPhone = /^1\d{10}$/;
		this.setData({  
			tradeTypeId : submitField.tradeTypeId,
			compTypeId : submitField.compTypeId,
			truckTypeId : submitField.truckTypeId,
			carTypeId : submitField.carTypeId,
			trucksPrice : submitField.trucksPrice,
			ctTypeId :submitField.ctTypeId,
			ctPpId : submitField.ctPpId,
			distance : submitField.distance,
			accIdentId : submitField.accIdentId,
			lxrName : submitField.lxrName,
			lxrTel : submitField.lxrTel,
			wqpfbzId : submitField.wqpfbzId,
			remark : submitField.remark
		});
		if(this.data.compTypeId == 2){
			this.setData({
				cpyName : submitField.cpyName
			});
		}
		if(this.data.isZlFlag){
			this.setData({
				jgzzId : submitField.jgzzId,
				psAreaName : submitField.psAreaName
			});
		}
		if(this.data.isDangerFlag){
			this.setData({
				potBandId : submitField.potBandId,
				volume : submitField.volume,
				gasTypeId : submitField.gasTypeId
			});
		}
		if(wx.getStorageSync('userId')){
			if(this.data.tradeTypeId == ''){
				util.showToast('请选择贸易类型');
			}else if(this.data.compTypeId == ''){
				util.showToast('请选择企业类型');
			}else if(this.data.truckTypeId == ''){
				util.showToast('请选择槽车类型');
			}else if(this.data.carTypeId == '' && this.data.truckTypeId == 1){
				util.showToast('请选择普货车型');
			}else if(this.data.carTypeId == '' && this.data.truckTypeId == 2){
				util.showToast('请选择危货车型');
			}else if(this.data.compTypeId == 2 && this.data.cpyName == ''){
				util.showToast('请选择公司');
			}else if(this.data.headImg == ''){
				util.showToast('请上传车辆主图');
			}else if(this.data.provName == ''){
				util.showToast('请选择车辆注册地');
			}else if(this.data.gznf == '请选择购置年份'){
				util.showToast('请选择购置年份');
			}else if(this.data.ctspny == '请选择车头上牌年月'){
				util.showToast('请选择车头上牌年月');
			}else if(this.data.trucksPrice == '' && this.data.tradeTypeId == 1){
				util.showToast('请输入租赁价格');
			}else if(this.data.trucksPrice == '' && this.data.tradeTypeId == 2){
				util.showToast('请输入买卖价格');
			}else if(this.data.tradeTypeId == 1 && !regNum.test( this.data.trucksPrice ) ){
				util.showToast('租赁价格应是大于等于0的正整数');
			}else if(this.data.tradeTypeId == 2 && !regNum.test( this.data.trucksPrice ) ){
				util.showToast('买卖价格应是大于等于0的正整数');
			}else if(this.data.ctTypeId == ''){
				util.showToast('请选择车头类型');
			}else if(this.data.ctPpId == ''){
				util.showToast('请选择车头品牌');
			}else if(this.data.tradeTypeId == 1 && this.data.jgzzId == ''){
				util.showToast('请选择进港资质');
			}else if(this.data.truckTypeId == 2 && this.data.potBandId == ''){
				util.showToast('请选择储罐品牌');
			}else if(this.data.truckTypeId == 2 && this.data.volume == ''){
				util.showToast('请输入储罐容积');
			}else if(this.data.truckTypeId == 2 && this.data.cgspny == '请选择储罐上牌年月'){
				util.showToast('请选择储罐上牌年月');
			}else if(this.data.distance == ''){
				util.showToast('请输入行驶里程(公里)');
			}else if(this.data.accIdentId == ''){
				util.showToast('请选择是否发生事故');
			}else if(this.data.lxrName == ''){
				util.showToast('请输入联系人姓名');
			}else if(this.data.lxrTel == ''){
				util.showToast('请输入联系人手机号码');
			}else if(!regPhone.test( this.data.lxrTel ) && this.data.lxrTel.length != 11){
				util.showToast('手机号码格式不对，请重新填写');
			}else if(this.data.tradeTypeId == 1 && this.data.psAreaName == ''){
				util.showToast('请选择运输范围');
			}else if(this.data.wqpfbzId == ''){
				util.showToast('请选择尾气排放标准');
			}else if(this.data.truckTypeId == 2 && this.data.gasTypeId == ''){
				util.showToast('请选择气源类型');
			}else if(this.data.truckTypeId == 2 && this.data.ctImg == ''){
				util.showToast('请上传车头行驶证');
			}else if(this.data.truckTypeId == 2 && this.data.gcxxzImg == ''){
				util.showToast('请上传罐车行驶证');
			}else if(this.data.truckTypeId == 2 && this.data.clyyzImg == ''){
				util.showToast('请上传车辆运营证');
			}else if(this.data.truckTypeId == 2 && this.data.jyhgzImg == ''){
				util.showToast('请上传储罐检验合格证');
			}else if(this.data.truckTypeId == 2 && this.data.aqfBgImg == ''){
				util.showToast('请上传安全阀检验报告');
			}else{
				
			}
			
			
			
		
		}
	},
	//获取对应普货或危货型号对应车辆类型
	getTrucksTypeDet : function(){
		if(this.data.truckTypeId == ''){
			util.showToast('请先选择槽车类型');
			return;
		}
		util.navigateTo('/pages/basic/getTrucksType/index?carTypeId=' + this.data.carTypeId + '&truckTypeId=' + this.data.truckTypeId);
	},
	getTruckHeadType : function(){
		util.navigateTo('/pages/basic/getTruckHeadType/index?ctTypeId=' + this.data.ctTypeId);
	},
	getTruckHeadBrand : function(){
		util.navigateTo('/pages/basic/getTruckHeadBrand/index?ctPpId=' + this.data.ctPpId);
	},
	getJgzz : function(){
		util.navigateTo('/pages/basic/getJgzz/index?jgzzId=' + this.data.jgzzId);
	},
	selPsArea : function(){
		util.navigateTo('/pages/basic/getPsArea/index?provOrderNo=' + this.data.provOrderNo);
	},
	getPotBrand : function(){
		util.navigateTo('/pages/basic/getPotBand/index?potBandId=' + this.data.potBandId);
	},
	getWqpfbz : function(){
		util.navigateTo('/pages/basic/getWqpfbz/index?wqpfbzId=' + this.data.wqpfbzId);
	},
	getGasType : function(){
		util.navigateTo('/pages/basic/getGasType/index?gasTypeId=' + this.data.gasTypeId);
	},
	uploadCtxxz : function(){
		this.selectUploadType('upCtImg');
	},
	uploadGcxxz : function(){
		this.selectUploadType('upGcxxzImg');
	},
	uploadClyyz : function(){
		this.selectUploadType('upClyyzImg');
	},
	uploadJyhgz : function(){
		this.selectUploadType('upJyhgzImg');
	},
	uploadAqfbg : function(){
		this.selectUploadType('upAqfBgImg');
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
				}else if(upOpt == 'upCtImg'){
					that.setData({
						ctImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upGcxxzImg'){
					that.setData({
						gcxxzImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upClyyzImg'){
					that.setData({
						clyyzImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upJyhgzImg'){
					that.setData({
						jyhgzImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upAqfBgImg'){
					that.setData({
						aqfBgImg: tempFilePaths[0]
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
							}else if(upOpt == 'upCtImg'){
								that.setData({
									ctImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upGcxxzImg'){
								that.setData({
									gcxxzImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upClyyzImg'){
								that.setData({
									clyyzImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upJyhgzImg'){
								that.setData({
									jyhgzImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upAqfBgImg'){
								that.setData({
									aqfBgImgSucc: JSON.parse(res1.data).datas
								});
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
	},
	bindDateChange : function(e){
		this.setData({
			gznf : e.detail.value,
			isSelDate_year : true
		});
	},
	bindDateChange_ct : function(e){
		this.setData({
			ctspny : e.detail.value,
			isSelDate_month_ct : true
		});
	},
	bindDateChange_pt : function(e){
		this.setData({
			cgspny : e.detail.value,
			isSelDate_month_pt : true
		});
	}
})