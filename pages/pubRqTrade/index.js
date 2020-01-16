const app = getApp();
const util = require('../../utils/util');
var sourceType = '',upSuccDetImgArr = [],previewImgArr = [];
Page({
	data:{
		currPageType : '',
		cpyName : '',
		cpyId:'',
		lqFacName : '',
		lqFacId : '',
		lqTypeName : '',
		lqTypeId : '', 
		headImg : '',
		succHeadImg : '',
		zzlName : '',
		djName : '',
		notUpLoadHeadImg : true,
		psAreaName:'',
		provOrderNo : '',
		zcriq : '请选择装车日期',
		lxrName : '',
		lxrTel : '',
		carCardNum : '',
		gcCardNum : '',
		driver : '',
		driverTel : '',
		yyyName : '',
		yyyTel : '',
		qfTxt1 : '',
		qfTxt2 : '',
		qfTxt3 : '',
		qfImg1 : '',
		qfImg1Succ : '',
		qfImg2 : '',
		qfImg2Succ : '',
		qfImg3 : '',
		qfImg3Succ : '',
		bdImg : '',
		bdImgSucc : '',
		whpImg : '',
		whpImgSucc : '',
		clImg :　'',
		clImgSucc : '',
		upload_picture_list : [],
		remark:'',
		isSelDate : false,
		isSelPsArea : false,
		isHasUpLenFlag : false
	},
	onLoad : function(options){
		this.setData({
			currPageType : options.currPageType
		});
	},
	onShow : function(){
	},
	formSubmit : function(e){
		let submitField = e.detail.value,
			regNum = /^\+?[1-9]\d*$/,
			regPriceNum = /^(0|[1-9][0-9]*)$/;
		this.setData({  
			cpyName : submitField.cpyName,
			yydName : submitField.yydName,
			lqName : submitField.lqName,
			zzlName : submitField.zzlName, 
			djName : submitField.djName,
			lxrName : submitField.lxrName,
			lxrTel : submitField.lxrTel,
			carCardNum : submitField.cphName,
			gcCardNum : submitField.gcphName,
			driver : submitField.sjName,
			driverTel : submitField.sjPhoneName,
			yyyName : submitField.yyyName,
			yyyTel : submitField.yyyPhoneName,
			qfTxt1 : submitField.qfName1,
			qfTxt2 : submitField.qfName2,
			qfTxt3 : submitField.qfName3,
			remark : submitField.remark
		});
		if(wx.getStorageSync('userId')){
			if(this.data.cpyName == ''){
				util.showToast('请选择公司');
			}else if(this.data.lqFacName == ''){
				util.showToast('请选择液厂');
			}else if(this.data.zzlName == ''){
				util.showToast('请输入装载量');
			}else if(!regNum.test( this.data.zzlName ) ){
				util.showToast('装载量应是大于0的正整数');
			}else if(this.data.djName == ''){
				util.showToast('请输入单价');
			}else if(!regPriceNum.test( this.data.djName ) ){
				util.showToast('单价应是大于等于0的正整数');
			}else if(this.data.zcriq == '请选择装车日期'){
				util.showToast('请选择装车日期');
			}else if(this.data.psAreaName == ''){
				util.showToast('请选择配送区域');
			}else if(this.data.lxrName == ''){
				util.showToast('请输入联系人姓名');
			}else if(this.data.lxrTel == ''){
				util.showToast('请输入联系人手机号码');
			}else if(!app.globalData.regPhone.test( this.data.lxrTel )){
				util.showToast('手机号码格式不对，请重新填写');
			}else if(this.data.carCardNum == ''){
				util.showToast('请选择车牌号');
			}else if(this.data.gcCardNum == ''){
				util.showToast('请选择挂车车牌号');
			}else if(this.data.driver == ''){
				util.showToast('请选择司机');
			}else if(this.data.yyyName == ''){
				util.showToast('请选择司机押运员');
			}else if(this.data.qfTxt1 == '' && this.data.qfTxt2 == '' && this.data.qfTxt3 == ''){
				util.showToast('至少要填一项铅封文字信息');
			}else if(this.data.qfImg1 == '' && this.data.qfImg2 == '' && this.data.qfImg3 == ''){
				util.showToast('至少要上传一张铅封图片');
			}else if(this.data.bdImg == ''){
				util.showToast('请上传磅单图片');
			}else if(this.data.whpImg == ''){
				util.showToast('请上传危化品许可证');
			}else if(this.data.clImg == ''){
				util.showToast('请上传车辆照片');
			}else{ 
				var url = '',type = '',otherImg='',_this = this;
				if(upSuccDetImgArr.length > 0){ 
					otherImg = upSuccDetImgArr.join(',');
				} 
				var field = {userId:wx.getStorageSync('userId'),cpyId:this.data.cpyName,gasFactotyId:this.data.lqFacId,gasTypeId:this.data.lqTypeId,gasVolume:this.data.zzlName,headImg:this.data.succHeadImg,gasPrice:this.data.djName,zcDate:this.data.zcriq,psArea:this.data.psAreaName,
					cpNo:this.data.carCardNum,jsyName:this.data.driver,jsyMobile:this.data.driverTel,yyrName:this.data.yyyName,yyrMobile:this.data.yyyTel,qfTxt1:this.data.qfTxt1,qfTxt2:this.data.qfTxt2,qfTxt3:this.data.qfTxt3,
					qfImg1:this.data.qfImg1Succ,qfImg2:this.data.qfImg2Succ,qfImg3:this.data.qfImg3Succ,gpsInfo:'',lxName:this.data.lxrName,lxTel:this.data.lxrTel,remark:this.data.remark,bdImg:this.data.bdImgSucc,whpImg:this.data.whpImgSucc,tructsImg:this.data.whpImgSucc,otherImg:otherImg};
			
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/gasTrade/addGasTrade';
					type = 'post';
				}
				//console.log(field)
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
								util.showToast('发布燃气买卖成功,等待后台审核中...');
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
							util.showToast('抱歉,您暂无权限发布燃气贸易');
						}else if(res.data.code == 80001){
							util.showToast('当前储燃气买卖信息审核已通过，暂不能修改');
						}
					}
				});
			}
		}
	},
	getCpyList : function(){
		console.log(this.data.cpyId )
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
		if(this.data.lqFacId == ''){
			util.showToast('请先选择液厂');
			return;
		}
		this.selectUploadType('upHeadImg');
	},
	bindDateChange : function(e){
		this.setData({
			zcriq : e.detail.value,
			isSelDate : true
		});
	},
	selPsArea : function(){
		util.navigateTo('/pages/basic/getPsArea/index?provOrderNo=' + this.data.provOrderNo);
	},
	getCarCardNum : function(){
		if(this.data.cpyId == ''){
			util.showToast('请先选择公司');
			return;
		}
		util.navigateTo('/pages/basic/getCarCardNum/index?cpyId=' + this.data.cpyId + '&carCardNum=' + this.data.carCardNum + '&currJump=cpJump');
	},
	getGcCardNum : function(){
		if(this.data.cpyId == ''){
			util.showToast('请先选择公司');
			return;
		}
		util.navigateTo('/pages/basic/getCarCardNum/index?cpyId=' + this.data.cpyId + '&gcCardNum=' + this.data.gcCardNum + '&currJump=gccpJump');
	},
	getDriver : function(){
		if(this.data.cpyId == ''){
			util.showToast('请先选择公司');
			return;
		}
		util.navigateTo('/pages/basic/getDriverYyy/index?cpyId=' + this.data.cpyId + '&driver=' + this.data.driver + '&currJump=driverJump');
	},
	getYyy : function(){
		if(this.data.cpyId == ''){
			util.showToast('请先选择公司');
			return;
		}
		util.navigateTo('/pages/basic/getDriverYyy/index?cpyId=' + this.data.cpyId + '&yyyName=' + this.data.yyyName + '&currJump=yyyJump');
	},
	upLoadQfImg1 : function(){
		this.selectUploadType('upQfImg1');
	},
	upLoadQfImg2 : function(){
		this.selectUploadType('upQfImg2');
	},
	upLoadQfImg3 : function(){
		this.selectUploadType('upQfImg3');
	},
	upLoadBdImg : function(){
		this.selectUploadType('upBdImg');
	},
	uploadWhpImg : function(){
		this.selectUploadType('upWhpImg');
	},
	uploadClImg : function(){
		this.selectUploadType('upClImg');
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
				}else if(upOpt == 'upQfImg1'){
					that.setData({
						qfImg1: tempFilePaths[0]
					});		
				}else if(upOpt == 'upQfImg2'){
					that.setData({
						qfImg2: tempFilePaths[0]
					});		
				}else if(upOpt == 'upQfImg3'){
					that.setData({
						qfImg3: tempFilePaths[0]
					});		
				}else if(upOpt == 'upBdImg'){
					that.setData({
						bdImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upWhpImg'){
					that.setData({
						whpImg: tempFilePaths[0]
					});	
				}else if(upOpt == 'upClImg'){
					that.setData({
						clImg: tempFilePaths[0]
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
							}else if(upOpt == 'upQfImg1'){
								that.setData({
									qfImg1Succ: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upQfImg2'){
								that.setData({
									qfImg2Succ: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upQfImg3'){
								that.setData({
									qfImg3Succ: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upBdImg'){
								that.setData({
									bdImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upWhpImg'){
								that.setData({
									whpImgSucc: JSON.parse(res1.data).datas
								});
							}else if(upOpt == 'upClImg'){
								that.setData({
									clImgSucc: JSON.parse(res1.data).datas
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
	}
})