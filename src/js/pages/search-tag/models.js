import axios from 'axios'
import apiUrls from 'common/api-urls'

export const getList = function (params) {
  // console.info('get tag list:', params)
  return axios.post(apiUrls.getTagList, params)
}

export const saveTag = function (params) {
  return axios.post(apiUrls.saveTag, params)
}

export const deleteTag = function (params) {
  // console.info('delete tag list:', params)
  return axios.get(apiUrls.deleteTag, {
    params: {
      ...params
    }
  })
}

export const decorateTagList = function (list, selectedTags) {
  return list.map(item => {
    item.label = item.tagName
    item.value = item.tagId
    // console.info(item.tagId, selectedTags, selectedTags.indexOf(item.tagId))
    item.checked = selectedTags.indexOf(item.tagId) >= 0
    return item
  })
}

export const decorateRuleData = function (list) {
  list = list.map(item => {
    item.label = item.ruleName
    item.value = item.ruleId

    return item
  })
  return list
}
