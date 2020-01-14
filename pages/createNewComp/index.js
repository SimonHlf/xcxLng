const app = getApp();
const util = require('../../utils/util');
var sourceType = '',upSuccDetImgArr = [],previewImgArr = [];
Page({
	data : {
		currPageType : '',
		compName : '',
		compTypeArr : [],
		compTypeFlag : false,
		compTypeName : '请选择公司类型',
		comTypeId : '',
		headImg : '',
		succHeadImg : '',
		upload_picture_list : [],
		isHasUpLenFlag : false,
		provName : '',
		cityName : '',
		lxrName :'',
		lxrTel : ''
	},
	onLoad : function(options){
		this.getCompType();
	},
	bindCompTypePicker : function(e){
		var _this = this;
		this.setData({
			 compTypeName : _this.data.compTypeArr[e.detail.value].name,
			 comTypeId : _this.data.compTypeArr[e.detail.value].id,
			 compTypeFlag : true
		});
	},
	getCompType : function(){
		var _this = this;
		wx.showLoading('加载中');
		wx.request({
			url :app.globalData.serverUrl + '/comType/queryComType',
			method:'get',
			data :{id:''},
			success : function(res){
				wx.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						compTypeArr : res.data.datas
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无公司类型');
				}
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
		let submitField = e.detail.value,regPhone = /^1\d{10}$/;
		this.setData({
			compName : submitField.compName,
			address : submitField.address,
			lxrName : submitField.lxrName,
			lxrTel : submitField.lxrTel
		});
		if(wx.getStorageSync('userId')){
			if(this.data.compName == ''){
				util.showToast('请输入公司名称');
			}else if(this.data.comTypeId == ''){
				util.showToast('请选择公司类型');
			}else if(this.data.provName == ''){
				util.showToast('请选择省市');
			}else if(this.data.address == ''){
				util.showToast('请输入公司地址');
			}else if(this.data.lxrName == ''){
				util.showToast('请输入联系人姓名');
			}else if(this.data.lxrTel == ''){
				util.showToast('请输入联系人手机号码');
			}else if(!regPhone.test( this.data.lxrTel ) && this.data.lxrTel.length != 11){
				util.showToast('手机号码格式不对，请重新填写');
			}else if(this.data.headImg == ''){
				util.showToast('请上传公司营业执照');
			}else if(upSuccDetImgArr.length == 0){
				util.showToast('请上传公司资质');
			}else if(upSuccDetImgArr.length > 5){
				util.showToast('公司资质图片最多上传5张');
			}else{
				var url = '',type = '',otherImg=upSuccDetImgArr.join(','),_this = this;
				var field = {owerUserId:wx.getStorageSync('userId'),name:this.data.compName,typeId:this.data.comTypeId,province:this.data.provName,city:this.data.cityName,county:'',address:this.data.address,lxname:this.data.lxrName,
					lxtel:this.data.lxrTel,yyzzImg:this.data.succHeadImg,bankName:'',bankNo:'',bankAcc:'',zzImg:otherImg};
				
				console.log(field)
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/company/addCompany';
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
								util.showToast('创建新公司成功,等待后台审核中...');
								setTimeout(function(){
									// let pages = getCurrentPages();
									// let prevPage = pages[pages.length - 2];
									// prevPage.setData({
									// 	isCanPubFlag : true
									// });
									wx.navigateBack({
										delta:1
									})
								},1800);
							}
						}else if(res.data.code == 1000){
							util.showToast('服务器错误');
						}else if(res.data.code == 20001){
							util.showToast('用户暂未登录,请先登录');
						}else if(res.data.code == 70001){
							util.showToast('抱歉,您暂无权限创建新公司');
						}else if(res.data.code == 50003){
							util.showToast('当前公司已被创建,请重新编辑');
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
		      count: 5, // 默认9，这里显示一次选择相册的图片数量 
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
				if(that.data.upload_picture_list.length >= 5){
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
		if(this.data.upload_picture_list.length < 5){
			this.setData({
				isHasUpLenFlag : false
			});
		}
	}
})