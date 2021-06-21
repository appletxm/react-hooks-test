// 是否需要配置权限控制(false时不开启权限控制)
export const PERMISSION_CONTROL = true;

/**
 * 系统设置类的常量
 */
// 菜单类型
export const MENU_TYPE = {
  1: '菜单',
  2: '按钮',
  3: '接口',
  4: '公共接口',
};
// 菜单归属类型
export const MENU_BE_LONG_TYPE = {
  1: '后台',
  2: '前台',
};
// 菜单是否显示
export const MENU_STATE = {
  1: '显示',
  0: '隐藏',
};
// 菜单权重
export const MENU_WEIGHT = {
  0: '普通用户',
  1: '管理员',
  2: '系统管理员',
};
// 菜单权重
export const USER_TYPES = {
  0: '普通用户',
  1: '管理员',
  2: '系统管理员',
};

/**
 * 角色类的常量
 */
// 角色分类
export const ROLE_TYPES = {
  0: '通用角色',
  1: '机构角色',
  2: '系统角色',
};
// 角色状态
export const ROLE_STATUES = {
  0: '正常',
  1: '停用',
};
// 部门状态
export const DEPARTMENT_STATUES = {
  0: '正常',
  1: '停用',
};
// 用户状态
export const USER_STATUS = {
  0: '有效',
  1: '失效',
};

/**
 * 翻页的常量定义
 */
export const PAGE_CONFIG = {
  pageSizes: [10, 20, 30, 40],
  layout: 'prev, pager, next, total, sizes', // , jumper
  simpleLayout: 'prev, pager, next',
  defaultPageSize: 10,
  defaultPageNo: 1,
};

export const DEFAULT_ERROR_MSG = '网络有问题，请稍后再试';

export const WEB_TITLE_PREFIX = '后台管理系统';

export const ERROR_CODE = 98511;
export const SCREEN_SIZE_OPTIONS = [
  {
    value: 0,
    label: '小尺寸',
  },

  {
    value: 1,
    label: '全屏',
  },
];

export const PLAYER_POSITIONS = [
  {
    id: 'te02-2256',
    label: '研修楼7楼大厅护士站',
    value: 'te02-2256',
  },
];
