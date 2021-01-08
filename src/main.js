import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from "vuetify";
import CoreuiVue from '@coreui/vue'
import VueSession from "vue-session";
import { VueSpinners } from "@saeris/vue-spinners";
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(VueSession);
Vue.use(Vuetify);
Vue.use(VueSpinners);
Vue.prototype.$log = console.log.bind(console)

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
