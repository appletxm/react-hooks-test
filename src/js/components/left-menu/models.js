import axios from 'axios'
import apiUrls from 'common/api-urls'
// import menuData from './menu-data.js'
import { setItem, getItem } from 'common/storage'

function sortByDesc(a, b) {
  return b.idx - a.idx;
}

function sortByAsc(a, b) {
  return a.idx - b.idx;
}

function getTreeMenuList(pid, children, rawMenuList) {
  rawMenuList.forEach(item => {
    // console.info(pid, item.id)
    if (pid === item.parentId) {
      item.children = []
      item.parentIds = pid + ',' + item.id
      children.push(item)
      getTreeMenuList(item.id, item.children, rawMenuList)
    }
  })
}

export function getNormalMenuList(rawMenuList) {
  const ortByDesc = false

  rawMenuList.sort(ortByDesc ? sortByDesc : sortByAsc)
  rawMenuList = rawMenuList.map(item => {
    item.id = item.resourceId + ''
    item.parentId = item.parentId + ''
    item.menuName = item.name
    item.parentIds = item.desc
    item.menuUrl = item.url
    item.menuIcon = item.icon
    item.sortNo = item.idx
    return item
  })

  const menuList = []
  getTreeMenuList('0', menuList, rawMenuList)

  return menuList
}

export function getLeftMenuList() {
  // return axios.get(apiUrls.getLeftMenuList, {
  //   params: {
  //     ...params
  //   }
  // })

  const leftRawMenu = getItem('leftMenu')

  leftRawMenu.data.push({
    resourceId: 6000,
    parentId: 0,
    name: '广告图片上传',
    permits: 'upload:tag',
    type: 1,
    url: '/ad/upload',
    layer: 2,
    idx: 6,
    icon: '',
    description: '',
    isHided: 0,
    isDeleted: 0,
    modifiedTime: '2020-11-02T23:58:33',
    createTime: '2020-11-02T23:58:35',
    children: null,
    selected: null,
    childSelected: null,
    parentName: null
  })

  // console.info('getLeftMenuList:', leftRawMenu)

  return Promise.resolve(leftRawMenu)
}

export function getAllMenuList(params) {
  // const defaultParams = {
  //   pageSize: 99999
  // }
  // params = Object.assign(defaultParams, params)
  return axios.get(apiUrls.getAllMenuList, {
    params: {
      ...params
    }
  })
}

export function getAllMenuTree(params) {
  return axios.get(apiUrls.getAllMenuTree, {
    params: {
      ...params
    }
  })
}

export function decorateMenuList(rawMenuList) {
  const menuNormalList = getNormalMenuList(rawMenuList)
  // console.info(menuNormalList)
  return menuNormalList
}

export function setMenuInfoToCache(userInfo) {
  const { resources } = userInfo.data || {}
  if (resources) {
    setItem('leftMenu', {
      data: resources
    })
  }
}
