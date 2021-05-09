import axios from 'axios'
import apiUrls from 'common/api-urls'
import { contentTypeJson } from 'common/axios-decorate'

export function getDictList(data) {
  return axios.get(apiUrls.getDictList, {
    params: {
      ...data
    }
  })
}

export function delDicts(data) {
  return axios.get(apiUrls.delDicts, {
    params: {
      ...data
    }
  })
}

export function getDict(data) {
  return axios.get(apiUrls.getDict, {
    params: {
      ...data
    }
  })
}

export function updateDict(data) {
  return axios.post(apiUrls.updateDict, {
    ...data
  }, {
    headers: { 'Content-Type': contentTypeJson },
  })
}

export function addDict(data) {
  return axios.post(apiUrls.addDict, {
    ...data
  }, {
    headers: { 'Content-Type': contentTypeJson },
  })
}

export function getCodeList(data) {
  return axios.get(apiUrls.getCodeList, {
    params: {
      ...data
    }
  })
}

export function delCodes(data) {
  return axios.get(apiUrls.delCodes, {
    params: {
      ...data
    }
  })
}

export function getCode(data) {
  return axios.get(apiUrls.getCode, {
    params: {
      ...data
    }
  })
}

export function updateCode(data) {
  return axios.post(apiUrls.updateCode, {
    ...data
  }, {
    headers: { 'Content-Type': contentTypeJson },
  })
}

export function addCode(data) {
  return axios.post(apiUrls.addCode, {
    ...data
  }, {
    headers: { 'Content-Type': contentTypeJson },
  })
}
