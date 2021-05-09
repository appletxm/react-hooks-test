import axios from 'axios'
import apiUrls from 'common/api-urls'
// import { contentTypeWww } from 'common/axios-decorate'

export function getUserList(data) {
  return axios.post(apiUrls.getUserList, {
    ...data
  })
}

export function resetUserPwd(data) {
  return axios.post(apiUrls.userSave, {
    ...data
  })
  // , {
  //   headers: { 'Content-Type': contentTypeWww },
  // }
  // )
}

// 失效或恢复用户
export function expireOrRecUser(data) {
  return axios.post(apiUrls.userSave, {
    ...data
  })
}

export function delUsers(data) {
  return axios.get(apiUrls.delUsers, {
    params: {
      ...data
    }
  })
}

export function getUser(data) {
  return axios.get(apiUrls.getUserInfo, {
    params: {
      ...data
    }
  })
}

export function saveUser(data) {
  return axios.post(apiUrls.userSave, {
    ...data
  })
}

// export function addUser(data) {
//   return axios.post(apiUrls.userSave, {
//     ...data
//   })
// }

export function getConfigVal(data) {
  return axios.get(apiUrls.getConfigVal, {
    params: {
      ...data
    }
  })
}
