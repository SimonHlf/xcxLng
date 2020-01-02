
var app = getApp();
var start_clientX;
var end_clientX;
 
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth
  },
 
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      }) 
    }
  },
 
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
 
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
    })
  }
})