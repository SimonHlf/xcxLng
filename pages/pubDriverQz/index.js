const app = getApp();
const util = require('../../utils/util');
var sourceType = '';
Page({
	data:{
		currPageType :'',
		headImg : '',
		headImgSucc : '',
		realName : '',
		age : '',
		sexArr : ['男','女'],
		marrayArr : ['未婚','已婚'],
		jzTypeArr : ["A1","A2","A3","B1","B2","C1","C2","C3","C4","D","E","F","M","N","P"],
		degreeArr : ['初中','中专/中技','高中','大专','本科','硕士','博士'],
		jlYear : [
			{"id" : "1-3","name" : "1-3年"},
			{"id" : "3-5","name" : "3-5年"},
			{"id" : "5-10","name" : "5-10年"},
			{"id" : "10-100","name" : "10年以上"}
		],
		isMarried : '是否已婚',
		sex : '选择性别',
		jzType : '选择驾照类型', 
		degree : '请选择学历',
		workYearName : '请选择工作年限',
		workYear : '',
		isSelMarray : false,
		isSelSex : false,
		isSelJzType : false,
		isSelDegree : false,
		isSelWorkXz : false,
		isSelWorkYear : false,
		provName : '',
		cityName : '',
		driveYear : '',
		phoneNum : '',
		address : '',
		qwyx : '',
		workTime : '',
		workExp : '',
		judgeSelf : '',
		graduate : ''
	},
	onLoad(options){
		this.setData({
			currPageType : options.currPageType
		});
	},
	formSubmit : function(e){
		var submitField = e.detail.value,regNumThanZero = /^\+?[1-9]\d*$/,regNum = /^(0|[1-9][0-9]*)$/;
		this.setData({
			realName : submitField.realName,
			driveYear : submitField.driveYear,
			age : submitField.age,
			phoneNum : submitField.phoneNum,
			address : submitField.address,
			qwyx : submitField.qwyx,
			workExp : submitField.workExp,
			judgeSelf :submitField.judgeSelf,
			graduate : submitField.graduate
		});
		if(wx.getStorageSync('userId')){
			if(this.data.headImg == ''){
				util.showToast('请上传头像');
			}else if(this.data.realName == ''){
				util.showToast('请输入真实姓名');
			}else if(this.data.sex == '选择性别'){
				util.showToast('请选择性别');
			}else if(this.data.age == ''){
				util.showToast('请输入年龄');
			}else if(!regNumThanZero.test(this.data.age)){
				util.showToast('年龄应为大于0的正整数');
			}else if(this.data.isMarried == '是否已婚'){
				util.showToast('请选择是否已婚');
			}else if(this.data.jzType == '请选择驾照类型'){
				util.showToast('请选择驾照类型');
			}else if(this.data.driveYear == ''){
				util.showToast('请输入您的驾龄');
			}else if(!regNumThanZero.test(this.data.driveYear)){
				util.showToast('驾龄应为大于0的正整数');
			}else if(this.data.phoneNum == ''){
				util.showToast('请输入您的手机号码');
			}else if(!app.globalData.regPhone.test( this.data.phoneNum )){
				util.showToast('手机号码格式不对，请重新填写');
			}else if(this.data.address == ''){
				util.showToast('请输入您的通讯地址');
			}else if(this.data.provName == ''){
				util.showToast('请选择希望工作地点');
			}else if(this.data.qwyx == ''){
				util.showToast('请输入您的期望月薪(0)为面议');
			}else if(!regNum.test(this.data.qwyx)){
				util.showToast('期望月薪应为大于等于0的正整数');
			}else if(this.data.workTime == ''){
				util.showToast('请选择您参加工作时间');
			}else if(this.data.workYearName == '请选择工作年限'){
				util.showToast('请选择工作年限');
			}else if(this.data.workExp == ''){
				util.showToast('请输入您的工作经历');
			}else if(this.data.judgeSelf == ''){
				util.showToast('请输入您的自我评价');
			}else{
				var url = '',type = '',_this = this;
				if(this.data.degree == '请选择学历'){
					this.setData({
						degree : ''
					});
				}
				var field = {userId:wx.getStorageSync('userId'),userName:this.data.realName,userMobile:this.data.phoneNum,jzYear:this.data.driveYear,jzType:this.data.jzType,
							wage:this.data.qwyx,province:this.data.provName,city:this.data.cityName,userType:2,userHead:this.data.headImgSucc,education:this.data.degree,age:this.data.age,
							sex:this.data.sex,workYear:this.data.workYear,workExp:this.data.workExp,colleges:this.data.graduate,marriage:this.data.isMarried,hot:0,remark:this.data.judgeSelf};
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/driverZp/addDriverQz';
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
								util.showToast('发布司机求职成功,等待后台审核中...');
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
						}else if(res.data.code == 50005){
							util.showToast('当前您已发布求职信息,不能重复发布');
						}
					}
				});
			}
		}
	},
	selectCity : function(e){
		this.setData({
			provName : e.detail.province,
			cityName :e.detail.city
		}); 
	},
	bindWorkExpPicker : function(e){
		var _this = this;
		this.setData({
			workYearName : _this.data.jlYear[e.detail.value].name,
			workYear : _this.data.jlYear[e.detail.value].id,
			isSelWorkYear : true
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