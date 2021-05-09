<template src="./template.html"></template>

<script>
import columns from './columns'
import { getList, saveTag, deleteTag, decorateRuleData } from './models'
import { getList as getRuleList } from '../search-rule/models'

export default {
  data() {
    return {
      columns,
      isLoading: false,
      pageSize: 10,
      totalCount: 0,
      current: 1,
      list: [],

      searchItems: {
        tagName: '',
        createDate: []
      },
      editForm: {
        tagId: '',
        tagName: '',
        description: '',
        ruleId: ''
      },
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { required: false, message: '请输入正确的标签描述', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ],
        ruleId: [
          { required: false, message: '请选择检索规则', trigger: 'blur' }
        ]
      },

      showEditDialog: false,

      ruleList: []
    }
  },

  created() {
    this.loadList()
    this.loadRuleList()
  },

  methods: {
    async loadList() {
      const { current, size, searchItems } = this
      const dateGap = []
      // const createDate = searchItems.createDate

      // const dateGap = []
      // const createDate = searchItems.createDate
      // if (createDate.length > 1) {
      //   dateGap.push(createDate[0].getTime())
      //   dateGap.push(createDate[1].getTime())
      // }

      const params = {
        size,
        current,
        tagName: searchItems.tagName,
        createDate: dateGap
      }
      this.isLoading = true

      const res = await getList(params)
      const { data } = res
      this.list = data.records
      this.totalCount = data.total

      this.isLoading = false
    },

    async loadRuleList() {
      const res = await getRuleList({
        size: 1000,
        current: 1
      })

      this.ruleList = decorateRuleData(res.data.records)
    },

    async doDeleteTag(tagId) {
      this.isLoading = true
      await deleteTag({ tagId })
      this.isLoading = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })

      this.showEditDialog = false
      this.loadList()
    },

    handleDelete(index, row) {
      this.$confirm('确认删除此标签?').then(() => {
        this.doDeleteTag(row.tagId)
      }).catch(() => {})
    },

    showDialog() {
      this.showEditDialog = true
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },

    handleNew() {
      this.showDialog()
      this.editForm.tagName = ''
      this.editForm.tagId = ''
      this.editForm.description = ''
    },

    async postEditRequest() {
      const { tagId, tagName, description, ruleId } = this.editForm
      const params = {
        tagName,
        description,
        ruleId: ruleId || -1
      }
      if (tagId) {
        params.tagId = tagId
      }
      this.isLoading = true
      await saveTag(params)
      this.isLoading = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })

      this.showEditDialog = false
      this.loadList()
    },

    doEditTag() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.postEditRequest()
        } else {
          return false;
        }
      });
    },

    handleEdit(index, row) {
      this.showDialog()
      this.editForm.tagName = row.tagName
      this.editForm.tagId = row.tagId
      this.editForm.description = row.description
      this.editForm.ruleId = row.ruleId === -1 ? '' : row.ruleId
    },

    doSearch() {
      this.current = 1
      this.loadList()
    },

    handlePageChange(val) {
      this.current = val
      this.loadList()
    },

    changeRule(val) {
      this.editForm.ruleId = val
    }
  }
}
</script>
