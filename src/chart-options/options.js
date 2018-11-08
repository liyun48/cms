module.exports = {
 bar: {
  colors:['#79bacd','#3a3a4f'],
  chart: {
    type: 'column'
  },
  credits:{
    enabled:false 
  },
  title: {
    text: '看点资讯统计表'
  },
  xAxis: {
    categories: [
      '推荐','测试','招聘','娱乐','其他'
    ],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: '列表样式个数'
    }
  },
  series: [{
    name: 'style-one',
    data: [49, 71, 106, 129, 144]
  }, {
    name: 'style-two',
    data: [83, 78, 98, 93, 106]
  }]
 }
}