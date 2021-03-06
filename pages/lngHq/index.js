// pages/lngHq/index.js
const app = getApp();
const util = require('../../utils/util');
var date = new Date();
var currDate = date.getFullYear() + "-" + util.appendZero( (date.getMonth() + 1) ) + "-" + util.appendZero( date.getDate() ); 
Page({
	data : { 
		isHasDataFlag : true,
		nowDate : currDate,
		selectDate : '' ,
		lngData : [],
		priceList : [],
		today : '',
		yesterday:  '',
		tomorrow : '',
		nowPage : 1,
		loading : false ,
		provPy : '',
		gtId : '',
		ycName : '',
		provOrderNo : '',
		isAllEmptyFlag : false
	},
	onShow(){
		if(this.data.ycName != '' || this.data.provPy != '' || this.data.gtId != '' || this.data.isAllEmptyFlag){
			this.setData({
				nowPage :1,
				loading : false,
				lngData : [],
				priceList : []
			});
			wx.pageScrollTo({
			  scrollTop: 0
			})
			this.loadLngData();
		} 
	},
	onHide(){
		this.setData({
			isAllEmptyFlag : false
		});
	},
	onLoad(){ 
		this.loadLngData();
	},
	onReachBottom : function(){
		if( !this.data.loading ){
			this.loadLngData();
		}
	},
	loadLngData : function(){
		var _this = this;
		let { nowPage,priceList } = this.data;
		this.setData({
			loading : true
		}); 
		let field = {provName:this.data.provPy,gtId:this.data.gtId,gsNamePy:this.data.ycName,priceDate:_this.data.selectDate,page:_this.data.nowPage,limit:50};
		//console.log(field)
		wx.request({
			url : app.globalData.serverUrl + '/lng/getPageLngPriceData',
			method: 'get',
			data:field,
			success : function(res){
				if(res.data.code == 200){
					//console.log(res)
					if(res.data.datas[0].lngPriceList.length > 0){
						nowPage += 1;
						priceList.push( ...res.data.datas[0].lngPriceList );
						_this.setData({ 
							priceList,
							lngData : res.data.datas[0],  
							today : res.data.datas[0].dateTitle.split(':')[1],
							yesterday : res.data.datas[0].dateTitle.split(':')[0],
							tomorrow : res.data.datas[0].dateTitle.split(':')[2],
							nowPage,
							loading : false,
							isHasDataFlag : true
						});
					}else{ 
						_this.setData({
							loading : false
						});
					}
				}else if(res.data.code == 1000){
					_this.setData({
						loading : false
					});
					util.showToast('服务器错误');
				}else if(res.data.code == 50001){
					util.showToast('暂无数据');
					_this.setData({
						isHasDataFlag : false,
						loading : false
					});
				}else if(res.data.code == 70001){
					_this.setData({
						loading : false
					});
					util.showToast('暂无权限访问lng行情记录');
				}
			}
		});
	},
	bindDateChange : function(e){
		this.setData({
			nowDate : e.detail.value,
			selectDate : e.detail.value,
			nowPage : 1,
			loading : false,
			lngData : [],
			priceList : []
		});
		wx.pageScrollTo({
		  scrollTop: 0
		})
		this.loadLngData();
	},
	goGfDet : function(e){
		let id = e.currentTarget.dataset.id;
		this.data.selectDate == '' ? this.data.selectDate = currDate : this.data.selectDate;
		var currField = JSON.stringify({gfId:id,specTjDate:this.data.selectDate});
		util.navigateTo('/pages/lngHqDet/index?currField='+currField);
	},
	goLngHqMsgPage : function(){
		util.navigateTo('/pages/lngHqMsg/index');
	},
	goFilter : function(){
		util.navigateTo('/pages/lngHq/filter?provOrderNo=' + this.data.provOrderNo + '&gtId=' + this.data.gtId);
	}
})