import Vue from 'vue'
import Vuex from 'vuex'

import seeds from './modules/seeds';

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    seeds,
  }
})
