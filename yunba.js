var mqtt = require('./utils/mqtt.min.js')
const yb_reg_addr = "http://reg.yunba.io:8383/device/reg/"
const platform = 2

var app = getApp()

function getTicket(appkey, success, failed) {
  wx.request({
    url: yb_reg_addr,
    data: {
      p:platform,
      a:appkey
    },
    method: "POST",
    success: function(res) {
      console.log(res.data)
      if (res.statusCode == 200) {
        var yb_reg_data = res.data
        wx.setStorage({
          key: 'yb_u_p_c',
          data: res.data,
          success: function (res) {
            success(yb_reg_data)
          },
          fail: function (res) {
            failed(res)
          }
        })
      } else {
        failed(res.data)
      }
    },
    fail: function(error) {
      console.log(error)
      failed(error)
    }
  })
}

function init(appkey, connected, failed) {
    var result = setupYunba(appkey, function(client){
      connected(client)
    }, function(error){
      failed(error)
    })
}

function setupYunba(appkey, connected, failed) {
  wx.getStorage({
    key: 'yb_u_p_c',
    success: function(res) {
      connectBroker(res.data.c, res.data.u, res.data.p, function(client){
        connected(client)
      }, function(error){
        failed(error)
      })
    },
    fail: function() {
      console.log("cannot get storge")
      getTicket(appkey, function(res){
        connectBroker(res.c, res.u, res.p, function(client) {
          connected(client)
        }, function (error) {
          failed(error)
        })
      }, function(error){
        failed(error)
      })
    }
  })
}

function connectBroker(clientId, username, password, success, failed) {
  var client = mqtt.connect("wxs://abj-front-wenjing1.yunba.io/mqtt",
    {
      port: 443,
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      clientId: clientId,
      username: username,
      password: password,
      keepalive: 60,
      reconnectPeriod: 1000
    });

  client.on('connect', function () {
    console.log("yunba connected")
    success(client)
  })
  client.on('reconnect', function() {
    console.log("reconnecting")
    // client.end()
  })
  client.on('message', function (topic, message) {
    console.log(message.toString())
  })
  client.on('close', function(){
    console.log("disconnected")
  //   client = mqtt.connect("wxs://abj-front-wenjing1.yunba.io/mqtt",
  //     {
  //       port: 443,
  //       protocolId: 'MQIsdp',
  //       protocolVersion: 3,
  //       clientId: clientId,
  //       username: username,
  //       password: password,
  //       keepalive: 60,
  //       reconnectPeriod: 1000
  //     });
  })
}

module.exports.init = init