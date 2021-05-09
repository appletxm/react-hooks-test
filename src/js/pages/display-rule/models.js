import axios from 'axios'
import apiUrls from 'common/api-urls'

export const getRuleList = function (params) {
  return axios.get(apiUrls.getRuleList, {
    params: {
      ...params
    }
  })
}

export const decorateData = function (list) {
  list = list.map(item => {
    const { rule } = item
    const { duration, screenSize } = rule
    item.durationLabel = duration + '秒'
    item.screenSizeLabel = (screenSize === '1' || screenSize === 1) ? '全屏' : '小尺寸'

    return item
  })

  return list
}

export const deleteRule = function (id) {
  return axios.get(apiUrls.removeRule, {
    params: {
      id
    }
  })
}

export const doValidate = function (params) {
  const { duration } = params
  const res = {
    result: true,
    message: ''
  }

  // if (!title) {
  //   return {
  //     result: false,
  //     message: '请输入正确的标题'
  //   }
  // }

  if (!(/^\d{2,}$/).test(duration) || duration < 10) {
    return {
      result: false,
      message: '播放时长需大于10秒'
    }
  }

  return res
}

export const updateRule = function (params) {
  return axios.get(apiUrls.updateRule, {
    params: {
      ...params
    }
  })
}
