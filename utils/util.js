const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function showLoading(content){
	wx.showLoading({
		title : content
	});
}
function hideLoading(){
	wx.hideLoading();
}
function showToastSuc(content) {
	wx.showToast({
		title: content,
		icon: 'success',
		duration: 1800
	})
}
function showToast(content) {
	wx.showToast({
		title: content,
		icon: 'none',
		duration: 1800
	})
}
function navigateTo(page) {
	wx.navigateTo({
		url: page
	})
}
function redirectTo(page) {
	wx.redirectTo({
		url: page
	})
}
function appendZero(obj){
	if (obj < 10) {
	  return '0' + obj
	} else {
	  return obj
	}
}
module.exports = {
	formatTime: formatTime,
	showLoading : showLoading,
	hideLoading : hideLoading,
	showToastSuc :showToastSuc,
	showToast　:　showToast,
	navigateTo : navigateTo,
	redirectTo : redirectTo,
	appendZero : appendZero
}
