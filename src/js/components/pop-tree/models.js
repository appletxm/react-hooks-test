const mockOptions = {
  data: [
    {
      id: 1,
      label: '中医',
      children: []
    }
  ]
}

export const getTree = function (node) {
  // console.info('getTree:', node.level)
  if (node && node.level === 0) {
    return Promise.resolve(mockOptions)
  } else if (node && node.level === 1) {
    return Promise.resolve({
      data: [
        {
          id: 2,
          label: '中医饮食'
        },
        {
          id: 3,
          label: '中医饮食'
        }
      ]
    })
  } else {
    return Promise.resolve({
      data: []
    })
  }
}
