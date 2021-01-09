import Vue from 'vue'
import Vuex from 'vuex'
import { axiosBase } from "./api/axios-base";
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  // makes sure the user is logged in even after
  accessToken: localStorage.getItem("access_token") || null, 
  // received data from the backend API is stored here.
  APIData: "" 
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
  updateLocalStorage(state, { access,  }) {
    localStorage.setItem("access_token", access);
    state.accessToken = access;
  },
  updateAccess(state, access) {
    state.accessToken = access;
  },
  destroyToken(state) {
    state.accessToken = null;
  }
}
const getters = {
  loggedIn(state) {
    return state.accessToken != null;
  }
};

const actions ={
  login(context, credentials) {
    return new Promise((resolve, reject) => {
      console.log(credentials)
      // send the username and password to the backend API:
      axiosBase
        .post(
          "/login/", credentials
        )
        //if successful update local storage:
        .then(response => {
          console.log(response.data)
          context.commit("updateLocalStorage", {
            access: response.data.key
          },
          ); // store the access token in localstorage
          resolve();
        })
        .catch(err => {
          console.log(err)
          reject(err);
        });
    });
  },
  logout(context) {
    if (context.getters.loggedIn) {
      return new Promise((resolve) => {
        axiosBase
          .post("/logout/")
          .then(response => {
            console.log(response.data.detail)
            localStorage.removeItem("access_token");
            context.commit("destroyToken");
          })
          .catch(err => {
            localStorage.removeItem("access_token");
            context.commit("destroyToken");
            resolve(err);
          });
      });
    }
  },
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})