/* global Vuex */

import mutations from './mutations'
import user from './modules/user'
import leftMenu from './modules/left-menu'

export const getStore = (state) => new Vuex.Store({
  state,
  actions: {},
  mutations,
  modules: {
    user,
    leftMenu
  }
})
