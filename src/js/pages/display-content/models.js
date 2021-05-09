import axios from 'axios'
import apiUrls from 'common/api-urls'

export const getDisplayContent = function (params) {
  return axios.post(apiUrls.getDisplayContent, {
    // params: {
    ...params
    // }
  })
}

export const updateContent = function (params) {
  return axios.post(apiUrls.updateDisplayRule, params)
}
