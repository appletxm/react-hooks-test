<template src="./template.html"></template>

<script>
import contentColumns from './content-columns'
import { getDisplayContent, updateContent } from './models'
import ContentDetail from 'pages/knowledge-content/edit'
// import { SCREEN_SIZE_OPTIONS, PLAYER_POSITIONS } from 'common/consts'
import { SCREEN_SIZE_OPTIONS } from 'common/consts'
import { doValidate } from 'pages/display-rule/models'
import { getUserInfoFromCache } from '../../app/models'
import { getDevicesDict } from 'pages/sysman/department/models'

const screenOptions = JSON.parse(JSON.stringify(SCREEN_SIZE_OPTIONS))
const defaultDuration = 300
const defaultScreenSize = 0

export default {
  components: {
    ContentDetail
  },

  data() {
    return {
      isLoading: false,
      status: 1,

      list: [],
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      columns: contentColumns,
      title: '',

      editKnowledgeId: '',
      editKnowledgeIndex: -1,
      ruleId: '',
      valid: '0',
      showEditDialog: false,
      screenOptions,
      ruleForm: {
        duration: defaultDuration,
        screenSize: defaultScreenSize,
        playerIds: []
      },

      // deviceOptions: PLAYER_POSITIONS
      deviceOptions: [],
      defaultPlayerIds: ''
    }
  },

  methods: {
    async loadContent() {
      const { title, pageNo } = this
      this.isLoading = true
      const res = await getDisplayContent({
        current: pageNo,
        title
      })
      this.isLoading = false
      const { data } = res
      this.list = res.data.records || []
      this.totalCount = data.total || data.totalCount

      this.list.forEach(item => {
        if (item.displayRule) {
          item.displayRule.content = JSON.parse(item.displayRule.content)
        }
      })

    },

    contentPageChange(pageNo) {
      this.pageNo = pageNo
      this.loadContent()
    },

    init() {
      this.loadContent()
    },

    handleEdit(index, row) {

      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields()
      }

      this.showEditDialog = true

      this.$nextTick(() => {
        this.editKnowledgeId = row.knowledgeId
        this.editKnowledgeIndex = index
        this.ruleId = row.displayRule ? row.displayRule.ruleId : null

        // if (this.ruleId) {
        //   this.ruleForm.ruleId = this.ruleId
        // }

        const ruleContent = row.displayRule ? row.displayRule.content : {}
        this.ruleForm.duration = this.ruleId ? ruleContent.duration : defaultDuration
        this.ruleForm.screenSize = this.ruleId ? ruleContent.screenSize : defaultScreenSize
        // this.ruleForm.valid = this.ruleId ? row.displayRule.valid : 0
        // console.info('defaultPlayerIds', this.defaultPlayerIds)
        this.ruleForm.playerIds = this.ruleId ? ruleContent.playerIds : this.defaultPlayerIds
      })
    },

    async doUpdateRule(rowIndex, knowledgeId, ruleParams) {
      this.isLoading = true
      const res = await updateContent({
        knowledgeId,
        ruleId: this.ruleId,
        content: JSON.stringify(ruleParams),
        valid: this.valid
      })

      this.isLoading = false

      if (res.code === 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        // ruleParams = JSON.parse(res.data.content)
        // this.$set(this['list'][rowIndex], 'displayRule', ruleParams)
        this.loadContent()
      }
    },

    changeRuleStatus(index, row) {
      const { knowledgeId, displayRule } = row
      const { duration, screenSize, playerIds } = displayRule.content
      this.valid = displayRule.valid === '0' ? '1' : '0'
      this.ruleId = displayRule.ruleId
      const ruleParams = {
        duration,
        screenSize,
        playerIds
      }
      this.doUpdateRule(index, knowledgeId, ruleParams)
    },

    async doEditRule() {
      this.ruleForm.title = 'edit'
      const { editKnowledgeIndex, editKnowledgeId, ruleForm } = this
      const res = doValidate(ruleForm)
      const { result, message } = res
      delete this.ruleForm.title

      if (result) {
        await this.doUpdateRule(editKnowledgeIndex, editKnowledgeId, {
          ...ruleForm
        })
        this.showEditDialog = false
      } else {
        this.$message({
          type: 'warning',
          message
        })
      }
      // this.loadContent()
    },

    doSearch() {
      this.pageNo = 1
      this.loadContent()
    },

    async loadDevicesDict() {
      this.isLoading = true
      const res = await getDevicesDict()
      this.isLoading = false
      const { data, code } = res
      const { department } = getUserInfoFromCache()
      const devices = JSON.parse(department.equipmentId)
      this.defaultPlayerIds = devices
      // console.info('devices', devices)
      if (code === 200) {
        data.forEach((item) => {
          if (devices && devices.includes(item.dictCode)) {
            const opt = {
              id: item.dictCode,
              label: item.dictValue,
              value: item.dictCode
            }
            this.deviceOptions.push(opt)
          }
        })
      }
    },

    doPreview() {
      // console.info('this.editKnowledgeId:', this.editKnowledgeId)
      if (!this.editKnowledgeId) {
        this.$message({
          showClose: true,
          message: '请先保存然后再预览',
          type: 'warning'
        })
        return false
      }
      window.open(`preview/index.html#/integrate?articleId=${this.editKnowledgeId}&mode=0`)
    }
  },

  created() {
    this.loadDevicesDict()
    this.init()
  }
}
</script>
