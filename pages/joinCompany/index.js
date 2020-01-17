Page({
	data : {
		tabNav : ['贸易商','设备厂商','物流公司'],
		currentTab : 0
	},
	getCurrentTabCon : function(e){
		var index = e.currentTarget.dataset.index,currSta = 0;
		if(this.data.currentTab == index){
			return;
		}
		this.setData({ 
			currentTab : index
		});
		if(this.data.currentTab == 0){//贸易商
			
		}else if(this.data.currentTab == 1){//设备厂商
			
		}else if(this.data.currentTab == 2){//物流公司
			
		} 
	},
	onLoad : function(){
		
	}
})