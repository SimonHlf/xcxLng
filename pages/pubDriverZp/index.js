const app = getApp();
const util = require('../../utils/util');
var welfareNameArr = [];
Page({
	data : {
		jzTypeArr : ["A1","A2","A3","B1","B2","C1","C2","C3","C4","D","E","F","M","N","P"],
		degreeArr : ['不限','初中','中专/中技','高中','大专','本科','硕士','博士'],
		jzType : '选择驾照类型',
		degree : '选择学历',
		gznx : '请选择工作年限',
		isSelJzType : false,
		isSelDegree : false,
		isSelWorkXz : false,
		isSelNx : false,
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
		]
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
			gznx : _this.data.workExpArr[e.detail.value],
			isSelNx : true
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