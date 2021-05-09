import axios from 'axios'
import apiUrls from 'common/api-urls'
import { contentTypeWww } from 'common/axios-decorate'

export function getMenuTree(data) {
  return axios.get(apiUrls.getMenuTree, {
    params: {
      ...data
    }
  })
}

export function expireOrRecMenu(data) {
  return axios.get(apiUrls.expireOrRecMenu, {
    params: {
      ...data
    }
  })
}

export function delMenus(data) {
  return axios.post(apiUrls.delMenus, {
    ...data
  }, {
    headers: { 'Content-Type': contentTypeWww },
  })
}

export function getMenu(data) {
  return axios.get(apiUrls.getMenu, {
    params: {
      ...data
    }
  })
}

export function updateMenu(data) {
  return axios.post(apiUrls.updateMenu, {
    ...data
  })
}

export function addMenu(data) {
  return axios.post(apiUrls.addMenu, {
    ...data
  })
}
