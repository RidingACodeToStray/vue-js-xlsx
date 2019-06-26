import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'                    // 引入element ui
import 'element-ui/lib/theme-chalk/index.css'       // 引入 element ui 样式

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'mini'                                      // set element-ui default size
})

new Vue({
  render: h => h(App),
}).$mount('#app')
