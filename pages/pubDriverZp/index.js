const app = getApp();
const util = require('../../utils/util');
var welfareNameArr = [];
Page({
	data : {
		currPageType: '',
		cpyName : '',
		cpyId : '',
		address : '',
		lxName : '', 
		lxTel : '',
		xinzi : '',
		zprs : '',
		provName : '',
		cityName : '',
		gwzz : '',
		jzTypeArr : ["A1","A2","A3","B1","B2","C1","C2","C3","C4","D","E","F","M","N","P"],
		degreeArr : ['不限','初中','中专/中技','高中','大专','本科','硕士','博士'],
		ageArr : [
			{"id":"20-30","name":"20-30岁"},
			{"id":"30-40","name":"30-40岁"},
			{"id":"40-50","name":"40-50岁"},
			{"id":"55-50","name":"50-55岁"}
		],
		jlYear : [
			{"id" : "1-3","name" : "1-3年"},
			{"id" : "3-5","name" : "3-5年"},
			{"id" : "5-10","name" : "5-10年"},
			{"id" : "10-100","name" : "10年以上"}
		],
		jzType : '选择驾照类型',
		degree : '选择学历',
		ageName : "请选择年龄",
		age:'',
		driveYearName :'选择驾龄',
		driveYear : '',
		workYearName : '请选择工作年限',
		workYear : '',
		isSelJzType : false,
		isSelDegree : false,
		isSelWorkXz : false,
		isSelAge : false,
		isSelJl : false,
		isSelWorkYear : false,
		welfare : [
			{"name" : "保险","state" : 0},
			{"name" : "年终奖","state" : 0},
			{"name" : "节日福利","state" : 0},
			{"name" : "带薪年假","state" : 0},
			{"name" : "餐补","state" : 0},
			{"name" : "通讯补助","state" : 0},
			{"name" : "住房补贴","state" : 0}, 
			{"name" : "公费旅游","state" : 0},
			{"name" : "提供住宿","state" : 0},
			{"name" : "交通补贴","state" : 0},
			{"name" : "公费培训","state" : 0},
			{"name" : "双休","state" : 0}
		], 
		isCanPubFlag : true,
		isBackBySelComp : false
	},
	onLoad(options){
		this.setData({ 
			currPageType : options.currPageType
		});
	},
	onShow(){
		if(this.data.isBackBySelComp){
			this.checkPubZpNum();
		}
	},
	checkPubZpNum : function(){
		var _this = this;
		wx.showLoading();
		console.log(this.data.cpyId) 
		wx.request({
			url : app.globalData.serverUrl + '/driverZp/getPubNum',
			method:'get',
			data:{userId:wx.getStorageSync('userId'),opt:1,compId:this.data.cpyId},
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			}, 
			success : function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					_this.setData({
						isCanPubFlag : true
					});
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 10002){
					util.showToast('获取发布招聘数量参数不能为空');
				}else if(res.data.code == 50005){
					//util.showToast('当前发布招聘信息最多为5条');
					_this.setData({
						isCanPubFlag : false
					});
				}
			}
		});
	},
	formSubmit : function(e){
		var submitField = e.detail.value,regNumThanZero = /^\+?[1-9]\d*$/,regNum = /^(0|[1-9][0-9]*)$/;
		this.setData({
			cpyId : submitField.cpyId,
			address : submitField.address,
			lxName : submitField.lxName,
			lxTel : submitField.lxTel,
			xinzi : submitField.xinzi,
			zprs : submitField.zprs,
			gwzz : submitField.gwzz
		});
		if(wx.getStorageSync('userId')){
			if(this.data.cpyName == ''){
				util.showToast('请选择公司');
			}else if(this.data.isCanPubFlag && this.data.address == ''){
				util.showToast('请输入公司地址');
			}else if(this.data.isCanPubFlag && this.data.lxName == ''){
				util.showToast('请输入联系人姓名');
			}else if(this.data.isCanPubFlag && this.data.lxTel == ''){
				util.showToast('请输入联系人手机号');
			}else if(this.data.isCanPubFlag && !app.globalData.regPhone.test( this.data.lxTel )){
				util.showToast('手机号码格式不对，请重新填写');
			}else if(this.data.isCanPubFlag && this.data.xinzi == ''){
				util.showToast('请输入招聘月薪(0)为面议');
			}else if(this.data.isCanPubFlag && !regNum.test(this.data.xinzi)){
				util.showToast('招聘月薪应为大于等于0的正整数');
			}else if(this.data.isCanPubFlag && this.data.jzType == '选择驾照类型'){
				util.showToast('请选择驾照类型');
			}else if(this.data.isCanPubFlag && this.data.driveYearName == '选择驾龄'){
				util.showToast('请选择要求驾龄年限');
			}else if(this.data.isCanPubFlag && this.data.ageName == '请选择年龄'){
				util.showToast('请输入招聘年龄要求');
			}else if(this.data.isCanPubFlag && this.data.degree == '选择学历'){
				util.showToast('请选择要求学历');
			}else if(this.data.isCanPubFlag && this.data.zprs == ''){
				util.showToast('请输入招聘人数');
			}else if(this.data.isCanPubFlag && !regNumThanZero.test(this.data.zprs)){
				util.showToast('招聘人数应为大于0的正整数');
			}else if(this.data.isCanPubFlag && this.data.workYearName == '请选择工作年限'){
				util.showToast('请选择要求工作年限');
			}else if(this.data.isCanPubFlag && this.data.provName == ''){
				util.showToast('请选择工作地址');
			}else if(this.data.isCanPubFlag && this.data.gwzz == ''){
				util.showToast('请输入岗位职责');
			}else{
				var url = '',type = '',_this = this,welfareStr = '';
				if(welfareNameArr.length > 0){
					welfareStr = welfareNameArr.join(',');
				}
				var field = {addUserId:wx.getStorageSync('userId'),compId:this.data.cpyId,jzType:this.data.jzType,wage:this.data.xinzi,sjAgeRange:this.data.age,
							jlYearRange:this.data.driveYear,province:this.data.provName,city:this.data.cityName,userType:2,address:this.data.address,lxName:this.data.lxName,lxTel:this.data.lxTel,
							remark:this.data.gwzz,education:this.data.degree,workYear:this.data.workYear,num:this.data.zprs,hot:0,welfare:welfareStr};
				if(this.data.currPageType == 'addPub'){
					url = app.globalData.serverUrl + '/driverZp/addDriverZp';
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
						console.log(res)
						if(res.data.code == 200){
							if(_this.data.currPageType == 'addPub'){
								util.showToast('发布司机招聘成功,等待后台审核中...');
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
							util.showToast('发布招聘条数不能超过5条');
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
	getCpyList : function(){
		util.navigateTo('/pages/basic/getCpyList/index?currPage=addDriverZpPage&cpyId=' + this.data.cpyId);
	},
	bindJlYearPicker : function(e){
		var _this = this;
		this.setData({
			 driveYearName : _this.data.jlYear[e.detail.value].name,
			 driveYear : _this.data.jlYear[e.detail.value].id,
			 isSelJl : true
		});
	},
	bindAgePicker : function(e){
		var _this = this;
		this.setData({
			ageName : _this.data.ageArr[e.detail.value].name,
			age :  _this.data.ageArr[e.detail.value].id,
			isSelAge : true
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
	bindWorkExpPicker : function(e){
		var _this = this;
		this.setData({
			workYearName : _this.data.jlYear[e.detail.value].name,
			workYear : _this.data.jlYear[e.detail.value].id,
			isSelWorkYear : true
		});
	},
	selWelfare : function(e){
		var index = e.currentTarget.dataset.key,
			nowName = e.currentTarget.dataset.name;
		if(this.data.welfare[index].state == 1){
			this.data.welfare[index].state = 0;
			for(var i=0;i<welfareNameArr.length;i++){
				if(nowName == welfareNameArr[i]){
					welfareNameArr.splice(i,1);
				}
			}
		}else if(this.data.welfare[index].state == 0){
			this.data.welfare[index].state = 1;
			welfareNameArr.push(this.data.welfare[index].name);
		}
		this.setData({
			welfare : this.data.welfare
		});
	}
})