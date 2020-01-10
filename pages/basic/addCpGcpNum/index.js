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
		cpyId : ''
	},
	onLoad(options){
		if(options.currJump == 'cpJump'){
			this.setData({
				currTit : '车头车牌'
			});
		}else if(options.currJump == 'gccpJump'){
			this.setData({
				currTit : '挂车车牌'
			});
		}
		this.setData({
			provView : this.data.cardTitle[0],
			wordsView : this.data.cardWords[0],
			cpyId : options.cpyId
		});
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
		console.log(this.data.nowUsePage)
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
		var _this = this,field = null,url = '',cardNum = '',reg =  /^[0-9a-zA-Z]+$/;
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
		if(this.data.currTit == '车头车牌'){
			field = {compId:this.data.cpyId,cp:cardNum};
			url = app.globalData.serverUrl + '/company/addTrucksHeadCp';
		}else{
			field = {compId:this.data.cpyId,gch:cardNum};
			url = app.globalData.serverUrl + '/company/addTrucksGcCp';
		}
		wx.request({
			url : url,
			method:'post',
			data :field,
			header: {
			  'content-type': 'application/x-www-form-urlencoded',
			},
			success : function(res){
				if(res.data.code == 200){
					util.showToast('添加' + _this.data.currTit + '成功');
					setTimeout(function(){
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.setData({
							addNewFlag :  true
						})
						wx.navigateBack({
							delta:1
						})
					},1500); 
				}else if(res.data.code == 1000){
					util.showToast('服务器错误');
				}else if(res.data.code == 50003){
					util.showToast('当前' + _this.data.currTit + '已存在,不能重复添加');
				}else if(res.data.code == 50003){
					util.showToast('您暂无增加' + _this.data.currTit + '的权限');
				}
			}
		});
	}
})