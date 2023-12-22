import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import Vuetify from 'vuetify';

import '@mdi/font/css/materialdesignicons.css'
import store from './store'

Vue.config.productionTip = false;

Vue.use(Vuetify)

new Vue({
  router,
  vuetify: new Vuetify({
    theme: {
      defaultTheme: 'dark'
    }
  }),
  store,
  render: h => h(App)
}).$mount("#app");