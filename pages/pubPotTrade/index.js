const app = getApp();
const util = require('../../utils/util');
var sourceType = '',upSuccDetImgArr = [],previewImgArr = [];
Page({
	data : {
		currPageType : '',
		isShowFlag : false,
		tradeTypeName : '',
		tradeTypeId : '',
		cpyName : '',
		cpyId : '',
		headImg : '',
		succHeadImg : '',
		potBandName : '',
		potBandId : '',
		volume : '',
		sxName : '',
		sxId : '',
		gznf : '请选择购置年份',
		zzjzName : '',
		zzjzId : '',
		provName : '',
		cityName : '',
		zmjg : '',
		xsjg : '',
		lxrName : '',
		lxrTel : '',
		upload_picture_list : [],
		remark : '',
		notUpLoadHeadImg : true,
		isSelDate : false,
		isHasUpLenFlag : false,
		provName : '',
		cityName : '',
		kezukemaiFlag : false
	},
	onLoad : function(options){
		this.setData({
			currPageType : options.currPageType
		});
	},
	selectCity : function(e){
		this.setData({
			provName : e.detail.province,
			cityName :e.detail.city
		}); 
	},
	getTradeType : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['可租可卖', '租','卖'],
			success: function(res) {
				if(res.tapIndex == 0){
					that.setData({
						tradeTypeName : '可租可卖',
						tradeTypeId : 0,
						kezukemaiFlag : true
					});
				}else if(res.tapIndex == 1){
					that.setData({
						tradeTypeName : '租',
						tradeTypeId : 1,
						kezukemaiFlag : false
					});
				}else if(res.tapIndex == 2){
					that.setData({
						tradeTypeName : '卖',
						tradeTypeId : 2,
						kezukemaiFlag : false
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	selIsHasSx : function(){
		var that = this;
		wx.showActionSheet({
			itemList: ['有', '无'],
			success: function(res) {
				if(res.tapIndex == 0){//有
					that.setData({
						sxName : '有',
						sxId : 1
					});
				}else if(res.tapIndex == 1){//无
					that.setData({
						sxName : '无',
						sxId : 2
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		});
	},
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addPotTradePage&cpyId=' + this.data.cpyId);
	},
	getPotBand : function(){
		util.navigateTo('/pages/basic/getPotBand/index?potBandId=' + this.data.potBandId);
	},
	getZzjz : function(){
		util.navigateTo('/pages/basic/getZzjz/index?zzjzId=' + this.data.zzjzId);
	},
	formSubmit : function(e){
		let submitField = e.detail.value,
			regNum = /^(0|[1-9][0-9]*)$/,
			regPhone = /^1\d{10}$/;
		this.setData({
			tradeTypeId : submitField.tradeTypeId,
			cpyName : submitField.cpyName,
			potBandId : submitField.potBandId,
			volume : submitField.volume,
			sxId : submitField.sxId, 
			zzjzId : submitField.zzjzId,
			zmjg : submitField.zmjg,
			lxrName : submitField.lxrName,
			lxrTel : submitField.lxrTel,
			remark : submitField.remark
		});
		if(this.data.kezukemaiFlag){
			this.setData({
				xsjg : submitField.xsjg
			});
		}
		if(wx.getStorageSync('userId')){
			if(this.data.tradeTypeId == ''){
				util.showToast('请选择贸易类型');
			}else if(this.data.cpyName == ''){
				util.showToast('请选择公司');
			}else if(this.data.headImg == ''){
				util.showToast('请上传储罐主图');
			}else if(this.data.potBandId == ''){
				util.showToast('请选择储罐品牌');
			}else if(this.data.volume == ''){
				util.showToast('请输入储罐容积');
			}else if(this.data.sxId == ''){
				util.showToast('请选择是否有手续');
			}else if(this.data.gznf == '请选择购置年份'){
				util.showToast('请选择购置年份');
			}else if(this.data.zzjzId == ''){
				util.showToast('请选择装载介质');
			}else if(this.data.provName == ''){
				util.showToast('请选择储罐所在地区');
			}else if(this.data.zmjg == ''){
				util.showToast('请输入租卖价格');
			}else if(!regNum.test( this.data.zmjg ) ){
				util.showToast('租卖价格应是大于等于0的正整数');
			}else if(this.data.kezukemaiFlag && this.data.xsjg == ''){
				util.showToast('请输入销售价格');
			}else if(this.data.kezukemaiFlag && !regNum.test( this.data.xsjg ) ){
				util.showToast('销售价格应是大于等于0的正整数');
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
				var field = {userId:wx.getStorageSync('userId'),compId:this.data.cpyName,mainImg:this.data.succHeadImg,potPpId:this.data.potBandId,potVol:this.data.volume,sxInfo:this.data.sxId,
					buyYear:this.data.gznf,zzjzTypeId:this.data.zzjzId,province:this.data.provName,city:this.data.cityName,leasePrice:this.data.zmjg,sellPrice:this.data.xsjg,
					tradeStatus:this.data.tradeTypeId,lxName:this.data.lxrName,lxTel:this.data.lxrTel,remark:this.data.remark,potDetailImg:otherImg};
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/potTrade/addPotTrade';
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
								util.showToast('发布储罐买卖成功,等待后台审核中...');
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
							util.showToast('发布储罐买卖参数不能为空');
						}else if(res.data.code == 70001){
							util.showToast('抱歉,您暂无权限发布储罐买卖');
						}else if(json.code == 80001){
							util.showToast('当前燃气储罐买卖信息审核已通过，暂不能修改');
						}
					}
				});
			}
		}
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
									succHeadImg: JSON.parse(res1.data).datas
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
			isSelDate : true
		});
	}
})