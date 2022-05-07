import Vue from 'vue'
import Vuex from 'vuex'
import relation from './modules/relation'
import entity from './modules/entity'
import ERGraph from './modules/ERGraph'
import pages from './modules/pages'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    entity,
    relation,
    ERGraph,
    pages,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters
})
