const app = getApp();
const util = require('../../../utils/util');
Page({
	data : {
		currTit : '',
		provView : '',
		wordsView : '',
		cardNum : '',
		cardTitle : ["京", "沪", "津", "渝", "冀", "豫", "云", "辽", "黑", "湘", "鲁", "新", "苏",  "浙", "赣", "鄂", "桂", "甘", "晋", "蒙", "陕", "吉", "闽", "贵", "粤", "川", "青", "藏", "琼", "宁"],
		cardWords : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		maskLayerFlag : true,
		isShow_prov : false,
		isShow_words : false,
		currOpenType : '', 
		value_prov : [0],
		value_words : [0],
		cpyId : '',
		currJump : '',
		cphId : '',
		gchId :''
	},
	onLoad(options){
		if(options.currJump == 'cpJump'){
			this.setData({
				currJump : 'cpJump',
				currTit : '添加车头车牌', 
				cpyId : options.cpyId,
				provView : this.data.cardTitle[0],
				wordsView : this.data.cardWords[0]
			});
		}else if(options.currJump == 'gccpJump'){
			this.setData({
				currJump : 'gccpJump',
				currTit : '添加挂车车牌',
				cpyId : options.cpyId,
				provView : this.data.cardTitle[0],
				wordsView : this.data.cardWords[0]
			});
		}else if(options.currJump == 'addByMine_ct'){
			this.setData({
				currJump : 'addByMine_ct',
				currTit : '添加车头车牌',
				cpyId : options.cpyId,
				provView : this.data.cardTitle[0],
				wordsView : this.data.cardWords[0]
			});
		}else if(options.currJump == 'addByMine_gc'){
			this.setData({
				currJump : 'addByMine_gc',
				currTit : '添加挂车车牌',
				cpyId : options.cpyId,
				provView : this.data.cardTitle[0],
				wordsView : this.data.cardWords[0]
			});
		}else if(options.currJump == 'editCphJump'){
			this.setData({
				currJump : 'editCphJump',
				currTit : '编辑车头车牌',
				cardNum : options.cph.substring(2,options.cph.length),
				cphId : options.id,
				provView : options.cph.substring(0,1),
				wordsView : options.cph.substring(2,1)
			});
		}else if(options.currJump == 'editGcJump'){
			this.setData({
				currJump : 'editGcJump',
				currTit : '编辑挂车车牌',
				cardNum : options.gch.substring(2,options.gch.length),
				gchId : options.id,
				provView : options.gch.substring(0,1),
				wordsView : options.gch.substring(2,1)
			});
		}
	},
	selProv : function(){
		this.setData({
			maskLayerFlag : false,
			isShow_prov : true,
			currOpenType : 'selProv'
		});
	},
	selWords : function(){
		this.setData({
			maskLayerFlag : false,
			isShow_words : true,
			currOpenType : 'selWrods'
		});
	},
	closeMask : function(){
		if(this.data.currOpenType == 'selProv'){
			this.close('prov');
		}else if(this.data.currOpenType == 'selWrods'){
			this.close('words');
		}
	},
	close : function(opt){
		if(opt == 'prov'){
			this.setData({
				maskLayerFlag : true,
				isShow_prov : false
			});
		}else if(opt == 'words'){
			this.setData({
				maskLayerFlag : true,
				isShow_words : false
			});
		}
	},
	bindChange_prov : function(e){
		const val = e.detail.value;
		this.setData({
			value_prov: val
		})
	},
	bindChange_words : function(e){
		const val = e.detail.value;
		this.setData({
			value_words: val
		})
	},
	selCurr : function(){
		if(this.data.currOpenType == 'selProv'){
			const val = this.data.value_prov;
			this.setData({
				provView : this.data.cardTitle[val],
			});
			this.close('prov');
		}else if(this.data.currOpenType == 'selWrods'){
			const val = this.data.value_words;
			this.setData({
				wordsView : this.data.cardWords[val],
			});
			this.close('words');
		}
	},
	cancel : function(){
		if(this.data.currOpenType == 'selProv'){
			this.close('prov');
		}else if(this.data.currOpenType == 'selWrods'){
			this.close('words');
		}
	},
	upperCase : function(e){
		if(e.detail.value != ''){
			this.setData({
				cardNum : e.detail.value.toUpperCase()
			});
		}
	},
	formSubmit : function(e){
		var _this = this,field = null,url = '',cardNum = '',reg =  /^[0-9a-zA-Z]+$/,type='';
		if(e.detail.value.cardNum == ''){
			util.showToast('请输入' + this.data.currTit);
			return;
		}
		if(e.detail.value.cardNum.length < 5){
			util.showToast(this.data.currTit + '长度须是5位');
			return;
		}
		if(!reg.test(e.detail.value.cardNum)){
			util.showToast(this.data.currTit + '应由数字和字母构成，不能含有其他特殊字符');
			return;
		}
		this.setData({
			cardNum : e.detail.value.cardNum
		});
		cardNum = this.data.provView + this.data.wordsView + this.data.cardNum;
		if(this.data.currJump == 'cpJump' || this.data.currJump == 'addByMine_ct'){
			field = {compId:this.data.cpyId,cp:cardNum,userId:wx.getStorageSync('userId')};
			url = app.globalData.serverUrl + '/company/addTrucksHeadCp';
			type = 'post';
		}else if(this.data.currJump == 'gccpJump' ||　this.data.currJump == 'addByMine_gc'){
			field = {compId:this.data.cpyId,gch:cardNum,userId:wx.getStorageSync('userId')};
			url = app.globalData.serverUrl + '/company/addTrucksGcCp';
			type = 'post';
		}else if(this.data.currJump == 'editCphJump'){//编辑车头车牌
			field = {id:this.data.cphId,cp:cardNum};
			url = app.globalData.serverUrl + '/company/updateHeadCp';
			type = 'put';
		}else if(this.data.currJump == 'editGcJump'){
			field = {id:this.data.gchId,gch:cardNum};
			url = app.globalData.serverUrl + '/company/updateCompanyGcCp';
			type = 'put';
		}
		wx.request({
			url : url,
			method:type,
			data :field,
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			},
			success : function(res){
				if(res.data.code == 200){
					util.showToast(_this.data.currTit + '成功');
					if(_this.data.currJump == 'cpJump' || _this.data.currJump == 'addByMine_ct' || _this.data.currJump == 'gccpJump' ||　_this.data.currJump == 'addByMine_gc'){
						setTimeout(function(){
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							if(_this.data.currJump == 'cpJump' || _this.data.currJump == 'addByMine_ct'){
								prevPage.setData({
									addNewFlag_ct :  true,
									addNewFlag : true
								})
							}else{
								prevPage.setData({
									addNewFlag_gc :  true,
									addNewFlag : true
								})
							}
							wx.navigateBack({
								delta:1
							})
						},1500); 
					}else if(_this.data.currJump == 'editCphJump' || _this.data.currJump == 'editGcJump'){
						setTimeout(function(){
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							if(_this.data.currJump == 'editCphJump'){
								prevPage.setData({
									isEditFlag_ct :  true
								})
							}else{
								prevPage.setData({
									isEditFlag_gc :  true
								})
							}
							wx.navigateBack({
								delta:1
							})
						},1500); 
					}
					
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50003){
					util.showToast('车头车牌/挂车车牌已存在,不能重复添加');
				}else if(res.data.code == 10002){
					util.showToast('参数不能为空');
				}else if(res.data.code == 70001){
					util.showToast('您暂无' + _this.data.currTit + '的权限');
				}
			}
		});
	}
})