import * as types from '../mutation-types';

const user = {
  state: {
    userInfo: {},
    permissionList: [],
    isAdmin: false,
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    isAdmin(state) {
      return state.isAdmin;
    },
  },
  mutations: {
    [types.USER_INFO](state, userInfo) {
      state.userInfo = userInfo;
    },

    [types.PERMISSION_LIST](state, permissionList) {
      state.permissionList = permissionList;
    },
  },
};

export default user;
