const app = getApp();
const util = require('../../utils/util');
import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    title: {
      text: '',
      left: 'center'
    },
    color: ["#3c7de9"],
    grid: {
    	x: 40,
    	x2: 40,
    	y: 30,
    	y2: 30
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
	  name : '日期',
      type: 'category',
      data: dateData,
	  nameTextStyle : {fontSize:10}
    },
    yAxis: {
	  name : '元',
      x: 'center',
      type: 'value',
	  nameTextStyle : {fontSize:10}
    },
    series: [
	{
	  name : 'lng价格',
	  type: 'line',
	  label : {
		  normal : {
			  fontSize : 14,
			  rich : {}
		  }
	  },
	  smooth: true,
	  data: priceData
	}]
  };

  chart.setOption(option);
  return chart;
}

let priceData=[],dateData = [];
Page({
	data : {
		nowDate : '',
		ec: {
		  onInit: initChart
		},
		gfId : '',
		specTjDate : '',
		gfname : '',
		priceNum : 0,
		province : '',
		gasName : '',
		yzNum : 0,
		mysNum : 0,
		lngHq : [],
		isShowYearFlag : true,
		isShowDateFlag : true,
		isShowMonthFlag : false,
		filterType : '按月汇总',
		yearTxt : '',
		finalDate : '' 
	},
	showFilterType : function(){
		var _this = this,currTypeTxt = '';
		wx.showActionSheet({
		  itemList: ['按月汇总', '按年汇总', '按日期汇总'],
		  success (res) {
			if(res.tapIndex == 0){
				currTypeTxt = '按月汇总';
				_this.setData({
					isShowMonthFlag : false,
					isShowYearFlag : true,
					isShowDateFlag : true,
					finalDate : _this.data.nowDate
				});
			}else if(res.tapIndex == 1){
				currTypeTxt = '按年汇总';
				_this.setData({
					isShowMonthFlag : true,
					isShowYearFlag : false,
					isShowDateFlag : true,
					finalDate : _this.data.yearTxt
				});
			}else{
				currTypeTxt = '按日期汇总';
				_this.setData({
					isShowMonthFlag : true,
					isShowYearFlag : true,
					isShowDateFlag : false,
					finalDate : _this.data.specTjDate
				});
			}
			_this.setData({
				filterType : currTypeTxt
			});
			_this.loadQueryEchart();
		  },
		  fail (res) {
		    console.log(res.errMsg)
		  }
		})
	},
	bindDateChange : function(e){
		this.setData({
			finalDate : e.detail.value,
			specTjDate : e.detail.value
		});
		this.loadQueryEchart();
	},
	bindYearChange : function(e){
		this.setData({
			finalDate : e.detail.value,
			yearTxt : e.detail.value,
		});
		this.loadQueryEchart();
	},
	bindMonthChange : function(e){
		this.setData({
			finalDate : e.detail.value,
			nowDate : e.detail.value,
			yearTxt : e.detail.value.substring(0,4)
		});
		this.loadQueryEchart();
	},
	loadQueryEchart : function(){
		var _this = this;
		var field = {gfId:_this.data.gfId,specTjDate:_this.data.finalDate};
		util.showLoading('拼命加载中...');
		//console.log(field)
		wx.request({
			url : app.globalData.serverUrl + '/lng/getReportLngPriceDate',
			method: 'get',  
			data : field,  
			success:function(res){
				util.hideLoading();
				console.log(res);
				priceData.length = 0;
				dateData.length = 0;
				for(var attr in res.data.datas){
					priceData[attr] = res.data.datas[attr].price;
					dateData[attr] = res.data.datas[attr].priceDate;
				}
				chart.setOption({
				  xAxis: {
					data: dateData  //全局变量
				  },
				  series: [{
					name: 'lng价格',
					data: priceData //全局变量
				  }]
				});
			}
		});
	},
	onLoad(options){
		this.setData({
			gfId : JSON.parse(options.currField).gfId,
			specTjDate : JSON.parse(options.currField).specTjDate,
			yearTxt : JSON.parse(options.currField).specTjDate.substring(0,4)
		});
		this.loadLngHqDet();
	}, 
	loadLngHqDet : function(){
		var _this = this; 
		util.showLoading('拼命加载中...');
		wx.request({
			url : app.globalData.serverUrl + '/lng/getLngPriceDetail',
			data : {gfId:_this.data.gfId,specDate:_this.data.specTjDate},
			method: 'get',
			success:function(res){
				util.hideLoading();
				console.log(res)
				if(res.data.code == 200){
					let resObj = res.data.datas[0];
					_this.setData({
						nowDate : resObj.specTjDate,
						finalDate : resObj.specTjDate,
						gfname : resObj.gfName,
						priceNum : resObj.currPrice,
						province : resObj.prov,
						gasName : resObj.gsType,
						yzNum : resObj.yzbgLength,
						mysNum : resObj.cpyLenth,
						lngHq : resObj.tjList
					});
					if(_this.data.lngHq.length > 0){
						for(var attr in _this.data.lngHq){
							priceData[attr] = _this.data.lngHq[attr].price;
							dateData[attr] = _this.data.lngHq[attr].priceDate;
						}
					}else{
						priceData.length = 0;
						dateData.length = 0;
					}
				}
			}
		});
	},
	checkYzBgImg : function(){
		util.navigateTo('/pages/lngHqYzbg/index?gfId=' + this.data.gfId);
	},
	checkMys : function(){
		util.navigateTo('/pages/lngHqMysList/index?gfId=' + this.data.gfId);
	}
}) 