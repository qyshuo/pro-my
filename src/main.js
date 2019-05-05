import Vue from 'vue'
import App from './App'
import router from './router'
// import ComCrumb from './components/share/crumb.vue'
import './router/crumb.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'

// 引入处理时间的过滤器
import moment from 'moment'

import ElementUI from 'element-ui'
Vue.use(ElementUI)
// 全局的时间过滤器
Vue.filter('dataFormat', v => {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

// axios配置请求公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
axios.interceptors.request.use(
  function(config) {
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// 给axios配置成为Vue的成员
Vue.prototype.$http = axios

// Vue.config.productionTip = false

/* eslint-disable no-new */
// Vue.component('com-crumb',ComCrumb)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
