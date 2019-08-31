var app = getApp();
var md5 = require("md5.js");
var util = require("util.js");

function SetIsBingPhone(url, params) {

  if (params["Auth"]) { //需用户授权验证

    wx.request({
      url: app.globalData.Net + url, //+ '/api/BindPhone/IsBingPhone',
      data: Object.assign(params),
      success: function(res) {
        wx.hideLoading();
        if (res.data.result == true) {
          wx.setStorageSync("MemberId", res.data.data.Id);
          wx.setStorageSync("LoginTime", new Date());
          wx.setStorageSync("AuthStatus", "SUCCESS");
          wx.showToast({
            title: "登录成功",
            mask: true
          });
          setTimeout(function() {
            if (type_ == "member") {
              wx.switchTab({
                url: '/pages/member/member',
              })
            } else {
              wx.navigateBack({

              })
            }
          }, 1500);
        } //授权成功
        else {
          wx.setStorageSync("LoginTime", new Date());
          wx.setStorageSync("AuthStatus", "FAIL");
          wx.showToast({
            title: res.data.message,
            icon: "none"
          });
        }
      }
    })

    if (wx.getStorageSync("AuthStatus") != "SUCCESS") {
      url = "/WX/WXBind/IsBingPhone";
      wx.navigateTo({
        url: '/pages/bindphone/bindphone'
      });
    }
  }

  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: app.globalData.Net + url,
        data: Object.assign({
          "memberid": wx.getStorageSync("MemberId"),
        }, params),
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    } catch (e) {
      console.log("异步获取数据抛出Error：" + e);
      wx.redirectTo({
        url: '/pages/error/error',
      })
    }
  });

}

function SetSendCode(url, params) {

  if (params["Auth"]) { //需用户授权验证
    if (wx.getStorageSync("AuthStatus") != "SUCCESS") {
      url = "/WX/WXLogin/SendCode";
      wx.navigateTo({
        url: '/pages/bindphone/bindphone'
      });
    }
  }

  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: app.globalData.Net + url,
        data: Object.assign({
          "memberid": wx.getStorageSync("MemberId"),
        }, params),
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    } catch (e) {
      console.log("异步获取数据抛出Error：" + e);
      wx.redirectTo({
        url: '/pages/error/error',
      })
    }
  });

}

function SetRequest(url, params) {
  if (params["Auth"]) { //需用户授权验证
    if (wx.getStorageSync("AuthStatus") != "SUCCESS") {
      url = "/api/Auth/NoAuth";
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
    }
  }

  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: app.globalData.Net + url,
        data: Object.assign({
          "memberid": wx.getStorageSync("MemberId"),
        }, params),
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    } catch (e) {
      console.log("异步获取数据抛出Error：" + e);
      wx.redirectTo({
        url: '/pages/error/error',
      })
    }
  });
}

function SetNewRequest(url, paramList) {

  var ParamsJson = JSON.stringify(paramList);
  var IsAuth = false;
  var String_MD5 = "";


  if (paramList != null && paramList.length > 0) {
    for (let i = 0; i < paramList.length; i++) {
      if (paramList[i].Name == "Auth") IsAuth = true;
      String_MD5 += paramList[i].Name + paramList[i].Value;
    }
  }

  if (IsAuth) { //需用户授权验证
    if (wx.getStorageSync("AuthStatus") != "SUCCESS") {
      url = "/api/Auth/NoAuth";
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
    }
  }

  return new Promise((resolve, reject) => {
    try {

      var Token = app.globalData.Token;
      var Secret = app.globalData.Secret;
      var Timestamp = new Date();
      Timestamp = Timestamp.Format("yyyy-MM-dd hh:mm:ss");
      var memberid = wx.getStorageSync("MemberId");
      var Sig = "";

      String_MD5 = "Timestamp" + Timestamp + "Memberid" + memberid + String_MD5 + "Secret" + Secret;
      Sig = md5.hexMD5(String_MD5);
      Token = md5.hexMD5("XBZY" + new Date().Format("yyyy-MM-dd"));

      wx.request({
        url: app.globalData.Net + url,
        data: Object.assign({
          "Memberid": wx.getStorageSync("MemberId"),
          "Token": Token,
          "Secret": Secret,
          "Timestamp": Timestamp,
          "Sig": Sig,
          "ParamsJson": ParamsJson,
        }),
        header: {
          'Content-Type': 'application/json',
          'HeadKey': app.globalData.HeadKey,
        },
        success: resolve,
        fail: reject
        // fail: () => {
        //   // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
        //   wx.showToast({
        //     title: "请求超时",
        //     mask: false
        //   });
        // }
      });
    } catch (e) {
      console.log("异步获取数据抛出Error：" + e);
      wx.redirectTo({
        url: '/pages/error/error',
      })
    }
  });
}

function OldLogin(options, type_) {
  if (wx.getStorageSync("AuthStatus") == "SUCCESS") {
    wx.showToast({
      title: "您已经登录过了",
      icon: "none"
    });
  } else {
    var res = options.detail;
    var that = this;
    if (res.errMsg == "getUserInfo:ok") { //用户确认授权
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.login({
        success: function(res1) {
          var jscode = res1.code; //登返回的code，
          var Data = {
            "code": jscode,
            "encryptedData": res.encryptedData,
            "iv": res.iv
          };


          wx.request({
            url: app.globalData.Net + '/api/Auth/SetUserInfo',

            data: {
              "code": jscode,
              "encryptedData": res.encryptedData,
              "iv": res.iv,
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.Data.result == true) {

                wx.setStorageSync("MemberId", res.data.Data.data.Id);
                wx.setStorageSync("LoginTime", new Date());
                wx.setStorageSync("AuthStatus", "SUCCESS");
                wx.showToast({
                  title: "登录成功",
                  mask: true
                });
                setTimeout(function() {
                  if (type_ == "member") {
                    wx.switchTab({
                      url: '/pages/my/my',
                    })
                  } else {
                    wx.navigateBack({

                    })
                  }
                }, 1500);
              } //授权成功
              else {
                wx.setStorageSync("LoginTime", new Date());
                wx.setStorageSync("AuthStatus", "FAIL");
                wx.showToast({
                  title: res.data.message,
                  icon: "none"
                });
              }
            }
          })
        }
      })
    }
  }
}

//记录层级页面
function RecordPage(nowpage) {

  //跳转之前页面赋值
  if (wx.getStorageSync("Jumppage") == "" || wx.getStorageSync("Jumppage") == null) {
    if (wx.getStorageSync("Nowpage") == "" || wx.getStorageSync("Nowpage") == null) {
      wx.setStorageSync("Oldpage", nowpage);
    } else {
      wx.setStorageSync("Oldpage", wx.getStorageSync("Nowpage"));
    }
  } else {
    wx.setStorageSync("Oldpage", wx.getStorageSync("Jumppage"));
  }


  //跳转页面赋值
  //跳转页面等于之前的now页面
  if (wx.getStorageSync("Nowpage") == "" || wx.getStorageSync("Nowpage") == null) {
    wx.setStorageSync("Jumppage", nowpage);
  } else {
    wx.setStorageSync("Jumppage", wx.getStorageSync("Nowpage"));
  }

  //当前页面赋值
  wx.setStorageSync("Nowpage", nowpage);


}

function Login(options, type_) {
  if (wx.getStorageSync("AuthStatus") == "SUCCESS") {
    wx.showToast({
      title: "您已经登录过了",
      icon: "none"
    });
  } else {
    var res = options.detail;
    var that = this;
    if (res.errMsg == "getUserInfo:ok") { //用户确认授权
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.login({
        success: function(res1) {
          var jscode = res1.code; //登返回的code，
          var Data = [{
              "Name": "code",
              "Value": jscode
            },
            {
              "Name": "encryptedData",
              "Value": res.encryptedData
            },
            {
              "Name": "iv",
              "Value": res.iv
            }
          ];


          var ParamsJson = JSON.stringify(Data);
          var String_MD5 = "";

          if (Data != null && Data.length > 0) {
            for (let i = 0; i < Data.length; i++) {
              String_MD5 += Data[i].Name + Data[i].Value;
            }
          }

          var Token = app.globalData.Token;
          var Secret = app.globalData.Secret;
          var Timestamp = new Date();
          Timestamp = Timestamp.Format("yyyy-MM-dd hh:mm:ss");
          var memberid = wx.getStorageSync("MemberId");
          var Sig = "";


          String_MD5 = "Timestamp" + Timestamp + "Memberid" + memberid + String_MD5 + "Secret" + Secret;
          Sig = md5.hexMD5(String_MD5);
          Token = md5.hexMD5("XBZY" + new Date().Format("yyyy-MM-dd"));

          wx.request({
            url: app.globalData.Net + '/api/Auth/SetUserInfo',
            data: Object.assign({
              "Memberid": wx.getStorageSync("MemberId"),
              "Token": Token,
              "Secret": Secret,
              "Timestamp": Timestamp,
              "Sig": Sig,
              "ParamsJson": ParamsJson,
            }),
            header: {
              'Content-Type': 'application/json',
              'HeadKey': app.globalData.HeadKey,
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.code == 1001) {
                wx.setStorageSync("MemberId", res.data.data.id);
                wx.setStorageSync("LoginTime", new Date());
                wx.setStorageSync("AuthStatus", "SUCCESS");
                wx.showToast({
                  title: "授权成功",
                  mask: true
                });

                // setTimeout(function() {
                  if (type_ == "member") {
                  //判断是否已经绑定手机
                    if (res.data.data.mobileNumber != null && res.data.data.mobileNumber != "")
                    {
                      wx.setStorageSync("BindStatus", true);
                      wx.reLaunch({
                        url: '/pages/my/my',
                      });
                    }
                    else
                    {
                      wx.reLaunch({
                        url: '/pages/login/login',
                      });
                    }
                  } else {
                    wx.navigateBack({

                    })
                  }
                // }, 1500);
              } //授权成功
              else {
                wx.setStorageSync("LoginTime", new Date());
                wx.setStorageSync("AuthStatus", "FAIL");
                wx.showToast({
                  title: res.data.message,
                  icon: "none"
                });
              }
            }
          })

        }
      })
    }
  }
}

function WXBingPhone(url, params) {

  if (params["Auth"]) { //需用户授权验证

    wx.request({
      url: app.globalData.Net + '/api/BindPhone/IsBingPhone',
      data: {
        "type": 3,
        "Phone": "15889480758",
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.result == true) {
          wx.setStorageSync("MemberId", res.data.data.Id);
          wx.setStorageSync("LoginTime", new Date());
          wx.setStorageSync("AuthStatus", "SUCCESS");
          wx.showToast({
            title: "登录成功",
            mask: true
          });
          setTimeout(function() {
            if (type_ == "member") {
              wx.switchTab({
                url: '/pages/member/member',
              })
            } else {
              wx.navigateBack({

              })
            }
          }, 1500);
        } //授权成功
        else {
          wx.setStorageSync("LoginTime", new Date());
          wx.setStorageSync("AuthStatus", "FAIL");
          wx.showToast({
            title: res.data.message,
            icon: "none"
          });
        }
      }
    })

    if (wx.getStorageSync("AuthStatus") != "SUCCESS") {
      url = "/api/BindPhone/IsBingPhone";
      wx.navigateTo({
        url: '/pages/bindphone/bindphone'
      });
    }
  }

  return new Promise((resolve, reject) => {
    try {
      wx.request({
        url: app.globalData.Net + url,
        data: Object.assign({
          "memberid": wx.getStorageSync("MemberId"),
        }, params),
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        // fail: reject
        fail: () => {
          // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
          wx.showToast({
            title: "请求超时",
            mask: false
          });
        }
      });
    } catch (e) {
      console.log("异步获取数据抛出Error：" + e);
      wx.redirectTo({
        url: '/pages/error/error',
      })
    }
  });

}

function GetCartNum() {
  var cartNum = 0
  var that = this;
  var data = that.SetNewRequest("/api/cart/GetCartList");
  data.then(function(json) {
    if (json.data.code == 1001 && json.data.data.length > 0) {
      // app.globalData.navData[3].msg = json.data.data.length;
      for (var i in json.data.data) {
        cartNum += json.data.data[i].ProductNumber;
      }

      app.globalData.navData[3].msg = cartnum;

    }

  });

}
function JumpPageDecide(jumpPage) {
  if (wx.getStorageSync("AuthStatus") == "SUCCESS" && wx.getStorageSync("BindStatus") ) {
      wx.navigateTo({
        url: jumpPage
      })
  }
  else {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  }
}
module.exports = {
  SetRequest: SetRequest,
  SetNewRequest: SetNewRequest,
  SetSendCode: SetSendCode,
  SetIsBingPhone: SetIsBingPhone,
  WXBingPhone: WXBingPhone,
  Login: Login,
  GetCartNum: GetCartNum,
  RecordPage: RecordPage,
  JumpPageDecide: JumpPageDecide,
}