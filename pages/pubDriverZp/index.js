const app = getApp();
const util = require('../../utils/util');
var welfareNameArr = [];
Page({
	data : {
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