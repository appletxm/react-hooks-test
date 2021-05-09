/* global VueRouter */

import NProgress from 'nprogress'
import { WEB_TITLE_PREFIX } from 'common/consts'
import baseRoutes from './base'
import bizRoutes from './biz'
import sysRoutes from './sys'

const routes = [
  ...baseRoutes,
  ...bizRoutes,
  ...sysRoutes
]
const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0
  NProgress.start();
  if (to.meta.title) {
    document.title = `${to.meta.title} | ${WEB_TITLE_PREFIX}`
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
