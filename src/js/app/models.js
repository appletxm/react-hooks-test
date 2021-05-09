import eventQueue from 'common/event-queue'
import { getItem } from 'common/storage'
import axios from 'axios'
import apiUrls from 'common/api-urls'
import { getLeftMenuList, decorateMenuList } from 'components/left-menu/models'

export function getUserInfoFromCache() {
  const userInfo = getItem('userInfo')
  if (userInfo) {
    return userInfo
  } else {
    return {}
  }
}

export function runEventQueue(route) {
  eventQueue.executeQueue(route)
}

export function clearQueue() {
  eventQueue.clearQueue()
}

export function getPermissionList(params) {
  const defaultParams = {
    belongType: 1
  }

  params = Object.assign(defaultParams, params)

  return axios.get(apiUrls.getPermissionList, {
    params: {
      ...params
    }
  })
}

export function getIsAdmin() {
  return axios.get(apiUrls.isAdmin)
}

export function getMenuListAndPermission() {
  let resolveCb = null
  let rejectCb = null
  const promise = new Promise((resolve, reject) => {
    resolveCb = resolve
    rejectCb = reject
  })

  Promise.all([
    // getPermissionList(),
    getLeftMenuList()
    // getIsAdmin()
  ]).then(res => {
    // const permissions = res[0]['data']['permissions']
    const rawMenuList = res[0]['data']
    // const isAdmin = res[2]['data']

    resolveCb({
      rawMenuList,
      menuList: decorateMenuList(rawMenuList)
      // permissions,
      // isAdmin
    })
  }).catch(err => {
    console.error('getMenuListAndPermission err:', err)
    rejectCb(err)
  })

  return promise
}
