const area = require('../../lib/area');
const component = {
	data: {
	  provinces: [],
	  province: "请选择省",
	  citys: [],
	  city: "市",
	  value: [0, 0],
	  isShow: false,
	  isHasSelFlag : false
	},
	attached : function(){
		let provData = area.areaData;
		this.setData({
			provinces: area.areaData,
			citys: area.areaData[0]['children'],
		});
	},
	methods : {
		bindChange : function(e){
			const val = e.detail.value;
			this.setData({
				value: val, 
				citys: this.data.provinces[val[0]]['children'].length > 0 ? this.data.provinces[val[0]]['children'] : [],
				isHasSelFlag :true
			})
		},
		closeModal() {
			this.setData({
				isShow: false
			})
		},
		togglePicker() {
			this.setData({
				isShow: !this.data.isShow
			})
		},
		cancel(){
			this.setData({
				isShow: false
			})
		},
		done(){
			const val = this.data.value;
			this.setData({
				province: this.data.provinces[val[0]].name,
			    city: this.data.provinces[val[0]]['children'].length > 0 ? this.data.provinces[val[0]]['children'][val[1]].name : '',
			    isShow: false,
				isHasSelFlag :true
			});
			this.triggerEvent('selected', {
				province: this.data.province,
			    city: this.data.city
			})
		}
	}
}
Component(component);