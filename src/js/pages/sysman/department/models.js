import axios from 'axios'
import apiUrls from 'common/api-urls'

export function getDevicesDict(data) {
  return axios.get(apiUrls.getDevicesDict, {
    ...data
  })
}

export function getDepartmentList(data) {
  return axios.post(apiUrls.getDepartmentList, {
    ...data
  })
}
export function getDepartmentsTree(data) {
  return axios.get(apiUrls.getDepartmentsTree, {
    params: {
      ...data
    }
  })
}

// 失效或恢复部门
export function expireOrRecDepartment(data) {
  return axios.get(apiUrls.expireOrRecDepartment, {
    params: {
      ...data
    }
  })
}

export function getDepartmentDetail(data) {
  return axios.get(apiUrls.getDepartmentDetail, {
    params: {
      ...data
    }
  })
}
// 部门名查重
export function checkDepartmentName(data) {
  return axios.get(apiUrls.checkDepartmentName, {
    params: {
      ...data
    }
  })
}

export function saveDepartment(data) {
  return axios.post(apiUrls.saveDepartment, data)
}

export function updateDepartment(data) {
  return axios.post(apiUrls.updateDepartment, {
    ...data
  })
}
export function delDepartments(data) {
  return axios.get(apiUrls.delDepartments, {
    params: {
      ...data
    }
  })
}
export function getDepartmentUserList(data) {
  return axios.get(apiUrls.getDepartmentUserList, {
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
// 获取某部门对应的用户组列表
export function getDepartmentGroupList(data) {
  return axios.get(apiUrls.getDepartmentGroupList, {
    params: {
      ...data
    }
  })
}
// 为部门分配用户组
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
