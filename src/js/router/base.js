const ErrorPage = () => import(/* webpackChunkName: "Error" */ 'pages/error')
// const Home = () => import(/* webpackChunkName: "Home" */ 'pages/home')
// const PermissionSample = () => import(/* webpackChunkName: "PermissionSample" */ 'pages/permission-sample')

export default [
  {
    path: '/',
    redirect: '/knowledge/category',
    meta: {
      title: '知识体系管理',
      keepAlive: true,
      auth: false,
    }
  },

  // {
  //   path: '/permission-test',
  //   component: PermissionSample,
  //   meta: {
  //     title: '权限测试页',
  //     auth: false,
  //     keepAlive: true,
  //   },
  // },

  {
    path: '*',
    component: ErrorPage,
    meta: {
      title: 'Not Found',
      auth: false,
      keepAlive: true,
    },
  }
];
