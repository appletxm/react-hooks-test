import axios from 'axios'
import apiUrls from 'common/api-urls'
import { BasicRule, TianGan, DiZhi } from './rule-consts'

export const hitItem = function (sourceList, hintValue) {
  const matched = sourceList.filter(item => item.value === hintValue)
  return matched || []
}

function getTimeRuleContent(ruleDetail) {
  const { subType, selectedItem } = ruleDetail
  let selectedItemText = ''

  const subTypeItem = hitItem(BasicRule, subType)[0]
  const subTypeName = subTypeItem.label

  if (subType === 'Nian' || subType === 'Yue' || subType === 'Ri') {
    const firstItemText = hitItem(TianGan['children'], selectedItem[0])[0].label
    const secondItemTxt = hitItem(DiZhi['children'], selectedItem[1])[0].label
    selectedItemText = firstItemText + secondItemTxt
  } else {
    selectedItemText = hitItem(subTypeItem['children'], selectedItem[0])[0].label
  }

  return `${subTypeName} : ${selectedItemText}`
}

export const getList = function (params) {
  return axios.post(apiUrls.getRuleList, params)

  // /* eslint-disable */
  // console.info('get rule list:', params)
  // return Promise.resolve({
  //   code: 200,
  //   data: {
  //     records: [{
  //       ruleId: 1,
  //       ruleName: '初运规则',
  //       ruleType: '1',
  //       ruleDetail: "{\"subType\": \"WuYun\",\"selectedItem\": \"ChuYun\"}",
  //       ruleDesc: '适应用于初运时间段类文章的检索的规则',
  //       createTime: '2020-12-17 12:00:00'
  //     },

  //     {
  //       ruleId: 2,
  //       ruleName: '季节规则',
  //       ruleType: '1',
  //       ruleDetail: "{\"subType\": \"JiJie\", \"selectedItem\": \"Xia\"}",
  //       ruleDesc: '适应用于夏季时间段类文章的检索的规则',
  //       createTime: '2020-12-17 12:00:00'
  //     },

  //     {
  //       ruleId: 3,
  //       ruleName: '年规则',
  //       ruleType: '1',
  //       ruleDetail: "{\"subType\": \"Nian\", \"selectedItem\": \"Jia,Si\"}",
  //       ruleDesc: '适应用于夏季时间段类文章的检索的规则',
  //       createTime: '2020-12-17 12:00:00'
  //     },

  //     {
  //       ruleId: 3,
  //       ruleName: '触发规则',
  //       ruleType: '2',
  //       ruleDetail: '子午流注#五运#六气',
  //       ruleDesc: '适应用于夏季时间段类文章的检索的规则',
  //       createTime: '2020-12-17 12:00:00'
  //     }
  //     ],
  //     total: 2,
  //     size: 10,
  //     current: 1,
  //     pages: 1
  //   },
  //   msg: '执行成功'
  // })
  // /* eslint-enable */
}

export const saveRule = function (params) {
  return axios.post(apiUrls.saveRule, params)

  // console.info('save rule :', params)
  // return Promise.resolve({
  //   code: 200,
  //   data: '',
  //   msg: '执行成功'
  // })
}

export const deleteRule = function (params) {
  axios.get(apiUrls.removeRule, {
    params: {
      ...params
    }
  })

  // console.info('delete rule :', params)
  // return Promise.resolve({
  //   code: 200,
  //   data: '',
  //   msg: '执行成功'
  // })
}
export const decorate = function (list, types) {
  list = list.map(item => {
    const { ruleDetail, ruleType } = item
    let content = ''

    const type = types.filter(typeNode => typeNode.value === item.ruleType)
    if (type && type.length > 0) {
      item.typeLabel = type[0]['label']
    }

    if (ruleType === '1') {
      const detail = ruleDetail ? JSON.parse(ruleDetail) : {}
      const { selectedItem } = detail

      detail.selectedItem = selectedItem ? selectedItem.split(',') : []
      item.ruleDetail = detail

      content = getTimeRuleContent(detail)
    } else {
      content = ruleDetail
    }

    item.content = content

    return item
  })
  return list
}

export const isComplexSubType = function (subType) {
  return subType === 'Nian' || subType === 'Yue' || subType === 'Ri'
}
