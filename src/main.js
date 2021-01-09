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

// if any of the routes in ./router.js has a meta named 'requiresAuth: true'
// then check if the user is logged in before routing to this path:
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) { 
    if (!store.getters.loggedIn) {
      next({ name: "Login" });
    } else {
      next()
    }
  }
  // else if any of the routes in ./router.js has a meta named 'requiresLogged: true'
  // then check if the user is logged in; if true continue to home page else continue routing to the destination path
  else if (to.matched.some(record => record.meta.requiresLogged)) {
    if (store.getters.loggedIn) {
      next({ name: "Dashboard" });
    } else {
      next();
    }
  }
  else {
    next();
  }
})



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
