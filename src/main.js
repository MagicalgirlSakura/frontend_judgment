// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import antd from 'ant-design-vue'
import Vuex from 'vuex'
import store from './store'
import 'ant-design-vue/dist/antd.css';
import elementUI from 'element-ui';
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(antd)
Vue.use(elementUI)
import {state} from './store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
