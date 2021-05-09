import axios from 'axios'
import apiUrls from 'common/api-urls'

export function modifyPassword(params) {
  return axios.post(apiUrls.modifyPassword, params)
}
