var config = {
  lineWidth: 2,
  yAxisWidth: 0,
  yAxisSplit: 8,
  xAxisHeight: 20,
  xAxisLineHeight: 15,
  legendHeight: 15,
  yAxisTitleWidth: 15,
  padding: 12,
  columePadding: 3,
  fontSize: 10,
  dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
  colors: ['#7cb5ec', '#f7a35c', '#ff0000', '#90ed7d', '#f15c80', '#8085e9'],
  pieChartLinePadding: 25,
  pieChartTextPadding: 15,
  xAxisTextPadding: 3,
  titleColor: '#333333',
  titleFontSize: 20,
  subtitleColor: '#999999',
  subtitleFontSize: 15,
  toolTipPadding: 3,
  toolTipBackground: '#000000',
  toolTipOpacity: 0.7,
  toolTipLineHeight: 14,
  radarGridCount: 3,
  radarLabelTextMargin: 15
};

function drawYAxisGrid(opts, config, context) {
}

function drawCharts(type, opts, config, context) {
  let width = opts.width
  let height = opts.height
  let cwidth = width/2
  let cheight = height/2
  let value = opts.value || 0;
  context.beginPath()
  context.setLineWidth(5)
  context.setStrokeStyle('#666')
  context.arc(cwidth, cheight, 50, 0, Math.PI*2)
  context.stroke()
  context.beginPath()
  context.setStrokeStyle('#f00')
  
  context.fillTextStyle = '#f00'
  context.setFontSize(16)
  // 设置文本对齐为水平垂直居中
  context.textAlign = 'center'
  context.textBaseline = "middle"
  context.fillText(value+'%',cwidth,cheight)
  context.draw()
  let step = value / 100 * Math.PI * 2/10
  let n = 1
  let inter = setInterval(()=>{
    context.beginPath()
    context.arc(cwidth, cheight, 50, Math.PI * 1.5 - step*n, Math.PI * 1.5)
    context.setStrokeStyle('#f00')
    context.stroke()
    context.draw(true)
    n+=1
    if (n === 11) clearInterval(inter)
  },500)
  
  var _this = this;

  var series = opts.series;
  var categories = opts.categories;

  var duration = opts.animation ? 1000 : 0;
  // this.animationInstance && this.animationInstance.stop();
  switch (type) {
    case 'ring-progress':
      drawYAxisGrid(opts, config, context);
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {

          drawYAxisGrid(opts, config, context);

          // var _drawColumnDataPoints = drawColumnDataPoints(series, opts, config, context, process),
          //   xAxisPoints = _drawColumnDataPoints.xAxisPoints,
          //   eachSpacing = _drawColumnDataPoints.eachSpacing;

          // _this.chartData.xAxisPoints = xAxisPoints;
          // _this.chartData.eachSpacing = eachSpacing;
          // drawXAxis(categories, opts, config, context);
          // drawLegend(opts.series, opts, config, context);
          // drawYAxis(series, opts, config, context);
          // drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        }
      });
      break;
  }
  // context.draw(false)
}

var Timing = {
  easeIn: function easeIn(pos) {
    return Math.pow(pos, 3);
  },

  easeOut: function easeOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },

  easeInOut: function easeInOut(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    } else {
      return 0.5 * (Math.pow(pos - 2, 3) + 2);
    }
  },

  linear: function linear(pos) {
    return pos;
  }
};

// simple event implement

function Event() {
  this.events = {};
}

Event.prototype.addEventListener = function (type, listener) {
  this.events[type] = this.events[type] || [];
  this.events[type].push(listener);
};

Event.prototype.trigger = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var type = args[0];
  var params = args.slice(1);
  if (!!this.events[type]) {
    this.events[type].forEach(function (listener) {
      try {
        listener.apply(null, params);
      } catch (e) {
        console.error(e);
      }
    });
  }
};

function Animation(opts) {
  this.isStop = false;
  opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
  opts.timing = opts.timing || 'linear';

  var delay = 17;

  var createAnimationFrame = function createAnimationFrame() {
    if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame;
    } else if (typeof setTimeout !== 'undefined') {
      return function (step, delay) {
        setTimeout(function () {
          var timeStamp = +new Date();
          step(timeStamp);
        }, delay);
      };
    } else {
      return function (step) {
        step(null);
      };
    }
  };
  var animationFrame = createAnimationFrame();
  var startTimeStamp = null;
  var _step = function step(timestamp) {
    if (timestamp === null || this.isStop === true) {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
      return;
    }
    if (startTimeStamp === null) {
      startTimeStamp = timestamp;
    }
    if (timestamp - startTimeStamp < opts.duration) {
      var process = (timestamp - startTimeStamp) / opts.duration;
      var timingFunction = Timing[opts.timing];
      process = timingFunction(process);
      opts.onProcess && opts.onProcess(process);
      animationFrame(_step, delay);
    } else {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
    }
  };
  _step = _step.bind(this);

  animationFrame(_step, delay);
}

var Charts = function Charts(opts) {
  opts.title = opts.title || {};
  opts.subtitle = opts.subtitle || {};
  opts.yAxis = opts.yAxis || {};
  opts.xAxis = opts.xAxis || {};
  opts.extra = opts.extra || {};
  opts.legend = opts.legend === false ? false : true;
  opts.animation = opts.animation === false ? false : true;
  
  this.opts = opts;
  
  this.context = wx.createCanvasContext(opts.canvasId);
  this.chartData = {};
  this.event = new Event();
  this.scrollOption = {
    currentOffset: 0,
    startTouchX: 0,
    distance: 0
  };

  drawCharts.call(this, opts.type, opts, config, this.context);
};

module.exports = Charts;