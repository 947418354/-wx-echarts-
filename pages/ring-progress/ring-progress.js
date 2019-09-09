// pages/ring-progress/ring-progress.js
import Eharts from '../../my-wx-echarts/components/ring-progress/ring-progress.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let echarts = new Eharts({
      canvasId: 'canvas1',
      type: 'ring-progress',
      timing: 1000,
      animation: false,
      title: {
        name: '图表标题',
        fontSize: 20
      },
      value: 19,
      dataLabel: true,
      categories: ['1', '2', '3', '4', '5', '6', '7'],
      series: [{
        name: '上周净水量',
        color: '#fff', //柱子的颜色
        data: [4, 5, 6.25, 1, 5, 3, 8],
        format: function(val, name) {
          return val + 'L';
          // return val.toFixed(1) + 'L';
        }
      }],
      dataItem: {
        color: '#fff'
      },
      yAxis: {
        fontColor: '#fff',
        disabled: false, //是否绘制Y轴
        format: function(val) { //返回数值
          return val;
        },
        min: 0, //最小值
        max: 8, //最大值
        disableGrid: true,
        gridColor: '#fff',
      },
      xAxis: {
        fontColor: '#fff', //数据颜色
        // min: 0,   //最小值
        // max: 8,   //最大值
        disableGrid: false, //不绘制X轴网格(去掉X轴的刻度)
        gridColor: '#fff',
        fontColor: '#fff',
        type: 'acalibration' //刻度
      },
      extra: {
        column: {
          width: 10
        }
      },
      // dataPointShape: true, //是否在图标上显示数据点标志
      width: 312, //图表展示内容宽度
      height: 300, //图表展示内容高度
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})