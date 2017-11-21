//app.js
var yunba = require('./yunba.js')

App({
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    var result = yunba.init("57988917176f4a3e5473dc43", function(client){
      that.globalData.ybClient = client
    }, function(error){
      console.log('error :'. error)
    })
  },
  globalData: {
    userInfo: null,
    client: null
  }
})