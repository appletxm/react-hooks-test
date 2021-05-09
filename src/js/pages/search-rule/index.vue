<template src="./template.html"></template>

<script>
import columns from './columns'
import { getList, saveRule, deleteRule, decorate, hitItem, isComplexSubType } from './models'
import { Types, BasicRule, TianGan, DiZhi } from './rule-consts'

export default {
  components: {},
  data() {
    return {
      searchItems: {
        ruleName: ''
      },

      columns,
      isLoading: false,
      pageSize: 10,
      totalCount: 0,
      current: 1,
      list: [],

      editForm: {
        ruleId: '',
        ruleType: '1',
        ruleName: '',
        ruleDesc: '',
        subType: 'WuYun',
        selectedItemMain: 'ChuYun',
        selectedItemSub: 'Zi',
        content: ''
      },
      rules: {
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        content: [
          { required: false, message: '请输入正确的触发关键字', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        ruleDesc: [
          { required: false, message: '请输入正确的标签描述', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ]
      },
      options: Types,
      subTypeOptions: BasicRule,
      selectedItemOption: BasicRule[0]['children'],
      subSelectedItemOption: DiZhi['children'],
      showEditDialog: false
    }
  },
  computed: {
    isComplexSubType() {
      return isComplexSubType(this.editForm.subType)
    }
  },

  watch: {},

  created() {
    this.loadList()
  },

  mounted() {
  },

  methods: {
    async loadList() {
      const { current, pageSize, searchItems } = this
      const params = {
        size: pageSize,
        current,
        ruleName: searchItems.ruleName
      }
      this.isLoading = true

      const res = await getList(params)

      const { data } = res
      this.list = decorate(data.records, Types)
      this.totalCount = data.total

      this.isLoading = false
    },

    doSearch() {
      this.current = 1
      this.loadList()
    },

    showDialog() {
      this.showEditDialog = true
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },

    handlePageChange(val) {
      this.current = val
      this.loadList()
    },

    handleNew() {
      this.showDialog()
    },

    handleEdit(index, row) {
      this.showDialog()

      const { ruleId, ruleName, ruleType, ruleDesc, ruleDetail, content } = row
      const { selectedItem, subType } = ruleDetail
      const editForm = {
        ruleId,
        ruleName,
        ruleType,
        ruleDesc,
        subType: subType || 'WuYun',
        selectedItemMain: selectedItem && selectedItem[0] ? selectedItem[0] : 'ChuYun',
        selectedItemSub: selectedItem && selectedItem[1] ? selectedItem[1] : 'Zi'
      }

      if (ruleType === '1') {
        if (isComplexSubType(subType)) {
          this.selectedItemOption = TianGan['children']
        } else {
          this.selectedItemOption = hitItem(BasicRule, subType)[0]['children']
        }
      } else {
        editForm.content = content
      }

      this.$set(this, 'editForm', editForm)
    },

    async postEditRequest() {
      const { ruleId, ruleName, ruleDesc, content, subType, selectedItemMain, selectedItemSub, ruleType } = this.editForm
      const params = {
        ruleName, ruleDesc, ruleType
      }
      if (ruleId) {
        params.ruleId = ruleId
      }

      if (ruleType === '1') {
        const selectedDetail = selectedItemMain + (isComplexSubType(subType) ? (',' + selectedItemSub) : '')
        params.ruleDetail = JSON.stringify({ subType, selectedItem: selectedDetail })
      } else {
        params.ruleDetail = content
      }

      this.isLoading = true
      const res = await saveRule(params)
      this.isLoading = false

      this.showEditDialog = false

      if (res.code === 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadList()
      }
    },
    doEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.postEditRequest()
        } else {
          return false;
        }
      });
    },

    async doDelete(id) {
      this.isLoading = true
      await deleteRule({ ruleId: id })
      this.isLoading = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })

      this.showEditDialog = false
      this.loadList()
    },
    handleDelete(index, row) {
      this.$confirm('确认删除此规则?').then(() => {
        this.doDelete(row.ruleId)
      }).catch(() => {})
    },

    changeType(val) {
      // console.info('changeType:', val)
      this.editForm.ruleType = val
    },

    changeSubType(val) {
      // console.info('changeSubType', val)
      this.editForm.subType = val
      if (isComplexSubType(val)) {
        this.editForm.selectedItemSub = 'Zi'
        this.selectedItemOption = TianGan['children']
      } else {
        this.selectedItemOption = hitItem(BasicRule, val)[0]['children']
      }
      this.editForm.selectedItemMain = this.selectedItemOption[0]['value']
    },

    changeSelectedItem(val) {
      // console.info('changeSelectedItem', val)
      this.editForm.selectedItemMain = val

    },

    changeSubSelectedItem(val) {
      // console.info('changeSubSelectedItem', val)
      this.editForm.selectedItemSub = val
    }

    // querySearch(str, cb) {
    //   cb(hitItem(BasicRule, str))
    // }
  }
}
</script>
