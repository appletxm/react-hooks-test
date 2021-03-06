/* globals Vue */
import axios from 'axios';
import { getTokenFromCookie } from 'common/auth';
import { qsStringfy } from 'utils/qs';
import * as errorHandler from 'common/error-handler';
import { ERROR_CODE } from 'common/consts';

const headerToken = 'Auth_Token';

export const contentTypeWww = 'application/x-www-form-urlencoded';
export const contentTypeJson = 'application/json;charset=UTF-8';
export const defaultTimeout = 60 * 1000; // 改为一分钟！
export const longTimeout = 80 * 1000;

function errorForAwaitHandle(error) {
  const msg = (error.message || error.errorMessage) || error.detailMessage;
  if (msg) {
    Vue.prototype.$message({
      message: msg,
      type: 'warning',
    });
  }

  return Promise.resolve({
    code: ERROR_CODE,
    message: msg,
  });
}

/* eslint-disable */
export function decorate() {
  const token = getTokenFromCookie()

  axios.defaults.withCredentials = false
  axios.defaults.header = true
  axios.defaults.timeout = longTimeout
  axios.defaults.headers['Content-Type'] = contentTypeJson

  // 如已登录，要带token
  if (token) {
    axios['defaults']['headers'][headerToken] = token
  }

  axios.interceptors.request.use(function (config) {
    if (config.method.toLowerCase() === 'post' && config.headers['Content-Type'] === contentTypeWww && config.data) {
      config.data = qsStringfy(config.data)
    }
    return config
  }, function (error) {
    // return Promise.reject(error)
    throw error
  })

  axios.interceptors.response.use(function (response) {
    let resData = response.data
    if (resData.code === '200' || resData.code === 200) {
      return resData
    } else {
      if (errorHandler.errorCodeMatch[resData.code]) {
        errorHandler.errorCodeMatch[resData.code](resData)
      } else {
        // return Promise.reject(resData)
        // throw resData
        errorForAwaitHandle(resData)
      }
    }
  }, function (error) {
    if (error.response) {
      const { status, data } = error.response
      if (status && errorHandler.errorCodeMatch[status]) {
        errorHandler.errorCodeMatch[status](data)
      } else {
        // return Promise.reject(error)
        // throw error
        errorForAwaitHandle(error)
      }
    } else {
      // throw error
      errorForAwaitHandle(error)
    }
  })
}

export function setHttpHeaderCookie(token) {
  axios.defaults.headers.Auth_Token = token || getTokenFromCookie()
}
/* eslint-enable */
