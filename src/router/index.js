import Vue from 'vue'
import Router from 'vue-router'
import test from '@/components/test'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    },
    
    {
      path:"/qualityshow",
      name: "qualityshow",
      component: () => import("../components/qualityshow.vue"),
    },
    {
      path:"/list",
      name: "list",
      component: () => import("../components/wenshuList.vue"),
    }
  ]
})
