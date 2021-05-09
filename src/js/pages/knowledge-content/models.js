import axios from 'axios'
import apiUrls from 'common/api-urls'

export const getList = function (params) {
  return axios.post(apiUrls.getKnowledgeList, {
    ...params
  })
}

export const decorateList = function (rawList, dict) {
  const list = rawList.map(item => {
    item.categoryLabel = item.categories.reduce((a, b) => {
      const reduceStr = a + (a && dict[b.categoryId] ? ', ' : '') + (dict[b.categoryId] || '')
      return reduceStr
    }, '')

    return item
  })

  return list
}

export const deleteContent = function (id) {
  return axios.get(apiUrls.removeKnowledge, {
    params: {
      id
    }
  })
}

export const getDetail = function (id) {
  return axios.get(apiUrls.getKnowledgeDetail, {
    params: {
      id
    }
  })
}

export const getSelectCategories = function (categories) {
  // const { data } = detail
  // const { categories } = data
  const list = []
  categories.forEach(item => {
    if (item.categoryId) {
      list.push(item.categoryId)
    }
  })
  return list
}

export const getVideoUrl = function (attachments) {
  // const { data } = detail
  // const { media } = data
  let medias = []

  medias = attachments.map(item => {
    if (item && item.type === 'video') {
      let url = item.url
      if (url.indexOf('http://') < 0) {
        url = window.location.origin + window.location.pathname + url
      }

      item.url = url
    }

    return item
  })

  return medias
}

export const doValidate = function (params) {
  const { title, selectedCategories, detail } = params
  const res = {
    result: true,
    message: ''
  }

  if (!title) {
    return {
      result: false,
      message: '请输入正确的标题'
    }
  }

  if (!selectedCategories || selectedCategories.length === 0) {
    return {
      result: false,
      message: '请选择文章所属内容体系'
    }
  }

  if (!detail || detail.indexOf('script') >= 0) {
    return {
      result: false,
      message: '请编辑文章内容正文'
    }
  }

  return res
}

export const submitArticle = function (params) {
  return axios.post(apiUrls.updateKnowledge, {
    // params: {
    ...params
    // }
  })
}

export const decorateRuleData = function (data) {
  const list = data.map(item => {
    const { id, title, rule } = item
    const { duration, screenSize } = rule || {}
    return {
      id,
      label: `${title}-${duration}秒/${screenSize ? '全屏播放' : '小尺寸播放'}`,
      value: id
    }
  })

  return list
}

export const doUploadFile = function (file, successCb, failCb) {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const request = new XMLHttpRequest();
  request.open('POST', apiUrls.upload);
  request.send(formData)

  request.onload = () => {
    if (successCb && typeof successCb === 'function') {
      successCb(request.responseText)
    }
  }

  // request.loadend = () => {
  //   this.isLoading = false
  //   document.querySelector('.upload-panel input').value = ''
  // }

  request.error = () => {
    if (failCb && typeof failCb === 'function') {
      failCb()
    }
  }
}

export const decorateTagsSelectedStatus = function (tagList, selectedTags) {
  return tagList.map(item => {
    if (selectedTags.indexOf(item.tagId) >= 0) {
      item.checked = true
    }
    return item
  })
}

export const getEditorUploadUrl = function () {
  return apiUrls.upload
}
