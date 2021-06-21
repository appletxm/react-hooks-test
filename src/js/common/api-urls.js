const { api, isMock, proxy } = require('env.cfg');

const needProxy = (proxy && proxy.needOpen) || isMock;
let apiHost = window.appInfo && window.appInfo.apiHost ? window.appInfo.apiHost : '';

apiHost = (needProxy ? '' : apiHost) + api;

export default {
  // User
  getUserInfo: `${apiHost}/api/user/detail`,
  getUserList: `${apiHost}/api/user/list`,
  userSave: `${apiHost}/api/user/save`,
  userLogin: `${apiHost}/api/sys/login`,
  // userLogin: `${apiHost}/api/sunAndMoon`,
  userLogout: `${apiHost}/api/sys/logout`,
  modifyPassword: `${apiHost}/api/user/modifyPassword`,

  // Menu
  getLeftMenuList: `${apiHost}/menu/backEnd/listTree`,
  getAllMenuList: `${apiHost}/api/menu/list`,
  getAllMenuTree: `${apiHost}/api/menu/menuTree`,

  // Department
  getDepartmentsTree: `${apiHost}/api/department/departmentTree`,
  getDepartmentList: `${apiHost}/api/department/list`,
  getDepartmentDetail: `${apiHost}/api/department/detail`,
  saveDepartment: `${apiHost}/api/department/save`,
  expireOrRecDepartment: `${apiHost}/api/department/setLock`,
  getDevicesDict: `${apiHost}/api/sysDict/getEqptsDict`,

  // Category
  addCategory: `${apiHost}/api/category/save`,
  updateCategory: `${apiHost}/api/category/save`,
  getKnowledgeCategories: `${apiHost}/api/category/getCategories`,
  removeCategory: `${apiHost}/api/category/remove`,
  getCategoriesDict: `${apiHost}/api/category/dict`,

  // Knowledge
  updateKnowledge: `${apiHost}/api/knowledge/save`,
  getKnowledgeList: `${apiHost}/api/knowledge/list`,
  getKnowledgeDetail: `${apiHost}/api/knowledge/detail`,
  removeKnowledge: `${apiHost}/api/knowledge/remove/`,
  upload: `${apiHost}/api/knowledge/uploadFile`,

  // Display rule
  // getRuleList: `${apiHost}/display/get/rules`,
  // removeRule: `${apiHost}/display/remove/rule`,
  // updateRule: `${apiHost}/display/update/rule`,
  getDisplayContent: `${apiHost}/api/displayrule/getKnowlList`,
  updateDisplayRule: `${apiHost}/api/displayrule/save`,

  // search target
  getTagList: `${apiHost}/api/search/getTagList`,
  saveTag: `${apiHost}/api/search/saveTag`,
  deleteTag: `${apiHost}/api/search/removeTag`,

  // search rule
  getRuleList: `${apiHost}/api/search/getRuleList`,
  saveRule: `${apiHost}/api/search/saveRule`,
  getRuleDetail: `${apiHost}/api/search/ruleDetail`,
  removeRule: `${apiHost}/api/search/removeRule/`,

  // upload ad
  uploadAd: `${apiHost}/api/attachment/adUpload`,
};
