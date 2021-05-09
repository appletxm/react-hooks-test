import axios from 'axios'
import apiUrls from 'common/api-urls'

export function getRoleList(data) {
  return axios.get(apiUrls.getRoleList, {
    params: {
      ...data
    }
  })
}
// 失效或恢复角色
export function expireOrRecRole(data) {
  return axios.get(apiUrls.expireOrRecRole, {
    params: {
      ...data
    }
  })
}

export function getRole(data) {
  return axios.get(apiUrls.getRole, {
    params: {
      ...data
    }
  })
}
// 角色名查重
export function checkRoleName(data) {
  return axios.get(apiUrls.checkRoleName, {
    params: {
      ...data
    }
  })
}

export function addRole(data) {
  return axios.post(apiUrls.addRole, {
    ...data
  })
}

export function updateRole(data) {
  return axios.post(apiUrls.updateRole, {
    ...data
  })
}
export function delRoles(data) {
  return axios.get(apiUrls.delRoles, {
    params: {
      ...data
    }
  })
}
export function getRoleUserList(data) {
  return axios.get(apiUrls.getRoleUserList, {
    params: {
      ...data
    }
  })
}
export function putUserIn(data) {
  return axios.post(apiUrls.putUserIn, {
    ...data
  })
}
// 获取某角色对应的用户组列表
export function getRoleGroupList(data) {
  return axios.get(apiUrls.getRoleGroupList, {
    params: {
      ...data
    }
  })
}
// 为角色分配用户组
export function putGroupIn(data) {
  return axios.post(apiUrls.putGroupIn, {
    ...data
  })
}
// 用户组用户选择列表
export function userListByGroupId(data) {
  return axios.get(apiUrls.userListByGroupId, {
    params: {
      ...data
    }
  })
}
