const MenuList = () => import(/* webpackChunkName: "MenuList" */ 'pages/sysman/menu/list.vue')
const ConfigList = () => import(/* webpackChunkName: "ConfigList" */ 'pages/sysman/config/index.vue')
const DictList = () => import(/* webpackChunkName: "DictList" */ 'pages/sysman/dict/list.vue')
const CodeList = () => import(/* webpackChunkName: "CodeList" */ 'pages/sysman/dict/list-code.vue')
const UserList = () => import(/* webpackChunkName: "UserList" */ 'pages/sysman/user/list.vue')
const Role = () => import(/* webpackChunkName: "Role" */ 'pages/sysman/role')
const DepartmentList = () => import(/* webpackChunkName: "DepartmentList" */ 'pages/sysman/department')

export default [
  {
    path: '/settings/menu',
    name: 'menu.list',
    component: MenuList,
    meta: {
      title: '菜单管理',
      menuPath: '/settings/menu'
    }
  },
  {
    path: '/settings/config',
    name: 'config.list',
    component: ConfigList,
    meta: {
      title: '配置管理',
      menuPath: '/settings/config'
    }
  },
  {
    path: '/settings/user',
    name: 'user.list',
    component: UserList,
    meta: {
      title: '用户列表',
      menuPath: '/settings/user'
    },
  },
  {
    path: '/settings/dict',
    name: 'dict.list',
    component: DictList,
    meta: {
      title: '字典类型列表',
      menuPath: '/settings/dict'
    }
  },
  {
    path: '/settings/code/:id/:codeTypeNum',
    name: 'code.list',
    component: CodeList,
    meta: {
      title: '字典列表',
      menuPath: '/settings/dict',
      notMatchedMenu: true
    }
  },
  {
    path: '/settings/role',
    name: 'role',
    component: Role,
    meta: {
      title: '角色列表',
      menuPath: '/settings/role'
    }
  },
  {
    path: '/settings/department',
    name: 'department',
    component: DepartmentList,
    meta: {
      title: '角色列表',
      menuPath: '/settings/department'
    }
  }
];
