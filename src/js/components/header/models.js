import axios from 'axios'
import apiUrls from 'common/api-urls'
// import { contentTypeWww } from 'common/axios-decorate'
import { removeItemAll } from 'common/storage'
import { removeAllCookie } from 'common/auth'

export function userLogout(data) {
  // return axios.post(apiUrls.userLogout, {
  //   ...data
  // }, {
  //   headers: { 'Content-Type': contentTypeWww }
  // })

  return axios.get(apiUrls.userLogout, { params: data })
}

export function clearCacheForLogout() {
  removeItemAll()
  removeAllCookie()
}
