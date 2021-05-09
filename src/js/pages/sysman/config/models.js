import axios from 'axios'
import apiUrls from 'common/api-urls'

export function getConfigList(data) {
  return axios.get(apiUrls.getConfigList, {
    params: {
      ...data
    }
  })
}

export function delConfigs(data) {
  return axios.get(apiUrls.delConfigs, {
    params: {
      ...data
    }
  })
}

export function getConfig(data) {
  return axios.get(apiUrls.getConfig, {
    params: {
      ...data
    }
  })
}

export function updateConfig(data) {
  return axios.post(apiUrls.updateConfig, {
    ...data
  })
}

export function addConfig(data) {
  return axios.post(apiUrls.addConfig, {
    ...data
  })
}
