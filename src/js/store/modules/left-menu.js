import * as types from '../mutation-types';

const leftMenu = {
  state: {
    isLeftbarCollapse: false,
    currentMenuItem: {},
    menuList: [],
    rawMenuList: [],
  },
  getters: {
    isLeftbarCollapse(state) {
      return state.isLeftbarCollapse;
    },
    menuList(state) {
      return state.menuList;
    },
  },
  mutations: {
    [types.LEFTBAR_CHANGE](state, val) {
      state.isLeftbarCollapse = !val;
    },
    [types.RAW_MENU_LIST](state, val) {
      state.rawMenuList = val;
    },
    [types.MENU_LIST](state, val) {
      state.menuList = val;
    },
    [types.CURRENT_MENU_ITEM](state, val) {
      state.currentMenuItem = val;
    },
  },
};

export default leftMenu;
