import axios from 'axios'
import apiUrls from 'common/api-urls'

export const getCategory = function () {
  return axios.get(apiUrls.getKnowledgeCategories)
}

export const addCategory = function (parentId, name) {
  return axios.post(apiUrls.addCategory, {
    parentId,
    name
  })
}

export const updateCategory = function (categoryId, name) {
  return axios.post(apiUrls.updateCategory, {
    categoryId,
    name
  })
}

export const removeCategory = function (id) {
  return axios.get(apiUrls.removeCategory, {
    params: {
      id
    }
  })
}

export const getCategoriesDict = function () {
  const dict = axios.get(apiUrls.getCategoriesDict).then(
    (res) => {
      const { code } = res
      if (code === 200) {
        const data = {}
        res.data.forEach(item => {
          data[item.categoryId] = item.name
        })
        return data
      }
    }
  )
  return dict
}
