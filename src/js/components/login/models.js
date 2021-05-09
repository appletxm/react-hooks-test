import axios from 'axios'
import apiUrls from 'common/api-urls'
import { setHttpHeaderCookie } from 'common/axios-decorate'
import { setItem } from 'common/storage'
import { setTokenToCookie } from 'common/auth'

export function userLogin(params) {
  params = JSON.parse(JSON.stringify(params))
  // return axios.post(apiUrls.userLogin, params)
  return axios.post(apiUrls.userLogin, params)
}

export function setUserInfoToCache(userInfo) {
  /* eslint-disable camelcase */
  const { token, name, userId, account, department } = userInfo.data

  setHttpHeaderCookie(token)
  setTokenToCookie(token)
  setItem('userInfo', { name, userId, account, userName: account, department })
  /* eslint-enable camelcase */
}
