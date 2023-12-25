import App from './App'
import UI from './sz-core/ui'

//TODO
import Mixin from './sz-core/mixins'
import AppMixin from './utils/mixins'

import request from '@/utils/request.js'; // 全局请求方法


// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.mixin(Mixin)
Vue.mixin(AppMixin)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(Mixin)
  app.mixin(AppMixin)
  return {
    app
  }
}
// #endif