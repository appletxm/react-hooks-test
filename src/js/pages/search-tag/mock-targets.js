const data = {
  code: 200,
  message: 'operation success',
  data: {
    list: [{
      tagId: '00001',
      tagName: '治未病',
      description: '',
      createTime: '2020-09-09 12:30:00'
    },
    {
      tagId: '00002',
      tagName: '伤寒',
      description: '',
      createTime: '2020-09-09 12:30:00',
    },

    {
      tagId: '00003',
      tagName: '天灸',
      description: '自灸、敷灸、药物灸、发疱灸',
      createTime: '2020-09-09 12:30:00'
    }
    ],
    curPageSize: 1,
    pageNo: 1,
    pageSize: 10,
    totalPage: 1,
    totalCount: 3
  }
}

const editResult = {
  code: 200,
  message: 'operation success',
  data: {}
}

export { data as default, editResult }
