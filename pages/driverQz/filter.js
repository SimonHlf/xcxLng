const app = getApp();
const util = require('../../utils/util');
Page({
	data : {
		jzType : '',
		jzYear : '',
		wage : '',
		jzTypeArr : ["A1","A2","A3","B1","B2","C1","C2","C3","C4","D","E","F","M","N","P"],
		jlYear : [
			{"id" : "1-3","name" : "1-3年"},
			{"id" : "3-5","name" : "3-5年"},
			{"id" : "5-10","name" : "5-10年"},
			{"id" : "10-100","name" : "10年以上"}
		],
		wageArr : [
			{"id" : "1000-3000","name" : "1-3千"},
			{"id" : "3000-5000","name" : "3-5千"},
			{"id" : "5000-10000","name" : "5000-1万"},
			{"id" : "10000-100000","name" : "1万以上"}
		],
		isAllEmptyFlag : false,
		jzTypeState:-1,
		jzYearState : -1,
		wageState:-1
	},
	onLoad : function(options){
		if(options.jzType != ''){
			this.setData({
				jzType : options.jzType 
			});
			for(var j=0;j<this.data.jzTypeArr.length;j++){
				if(this.data.jzType == this.data.jzTypeArr[j]){
					this.setData({
						jzTypeState : j
					});
				}
			}
		}
		if(options.jzYear != ''){
			this.setData({
				jzYear : options.jzYear 
			});
			for(var j=0;j<this.data.jlYear.length;j++){
				if(this.data.jzYear == this.data.jlYear[j].id){
					this.setData({
						jzYearState : j
					});
				}
			}
		}
		if(options.wage != ''){
			this.setData({
				wage : options.wage 
			});
			for(var j=0;j<this.data.wageArr.length;j++){
				if(this.data.wage == this.data.wageArr[j].id){
					this.setData({
						wageState : j
					});
				}
			}
		}
	},
	selectJzType: function (e) {
		var id = e.currentTarget.dataset.id; 
		this.setData({
			jzTypeState:e.currentTarget.dataset.key,
			jzType : id
		});
	}, 
	selectJl : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			jzYearState:e.currentTarget.dataset.key,
			jzYear : id
		});
	},
	selectWage : function(e){
		var id = e.currentTarget.dataset.id;
		this.setData({
			wageState:e.currentTarget.dataset.key,
			wage : id
		});
	},
	formSubmit : function(e){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		if(this.data.jzType == '' && this.data.jzYear == '' && this.data.wage == ''){
			this.setData({
				isAllEmptyFlag : true
			});
		}
		prevPage.setData({
			jzType : this.data.jzType,
			jzYear : this.data.jzYear,
			wage : this.data.wage,
			isAllEmptyFlag : this.data.isAllEmptyFlag
		})
		wx.navigateBack({
			delta:1
		}) 
	},
	resetFilter : function(){
		var _this = this;
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({
			jzType : '',
			jzYear : '',
			wage : '',
			isAllEmptyFlag : true
		}) 
		wx.navigateBack({
			delta:1
		})
	}
}) 