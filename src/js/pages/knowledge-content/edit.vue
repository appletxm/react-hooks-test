<template src="./edit-template.html"></template>

<script>
/* globals UE */

import { getCategory } from '../knowledge-category/models'
import { getDetail, getSelectCategories, doValidate, submitArticle, doUploadFile, decorateTagsSelectedStatus, getEditorUploadUrl } from './models'
import { getList, decorateTagList } from '../search-tag/models'

const mediaTypes = ['mp3', 'wave', 'mp4', 'mpeg', 'mpg', 'webm', 'ogg', 'avi', 'flv', 'mov', 'quicktime']

export default {
  components: {},

  props: {
    detailId: {
      type: [Number, String],
      default: ''
    },

    isReadOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      mediaTypes: mediaTypes || [],
      id: null,
      isLoading: false,
      isUploading: false,
      contentForm: {
        title: '',
        selectedCategories: [],
        detail: '',
        attachments: [],
        ruleId: '',
        slectedTags: []
      },
      props: {
        label: 'name',
        children: 'children'
      },
      tree: [],

      limit: 1,
      maxFileSize: 10 * 1024 * 1024 * 1024, // 1GB
      baseUrl: window['appInfo']['apiHost'],

      tags: {
        list: [],
        pageSize: 15,
        pageNo: 1,
        total: 0,
        tagName: ''
      },

      editor: null,
      tagsSelectedlist: []
    }
  },

  computed: {
    // 'tagsSelectedlist'() {
    //   return this.tags.list.filter(item => item.checked === true)
    // }
  },

  watch: {
    'detailId'(val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    handleCheckChange(data, checked) {
      if (!data.categoryId) {
        return false
      }
      const selected = this.contentForm.selectedCategories
      if (checked) {
        if (selected.indexOf(data.categoryId) === -1) selected.push(data.categoryId);
      } else {
        selected.splice(selected.findIndex(e => e === data.categoryId), 1)
      }
    },

    async init() {
      this.id = this.$route.query.id || this.detailId
      await this.getKnowledgeDetail()
      await this.loadCategory()
      await this.loadTags()
    },

    async loadCategory() {
      this.isLoading = true
      const res = await getCategory()
      this.tree = res.data
      this.isLoading = false
    },

    triggerUpload(event) {
      event.currentTarget.nextElementSibling.click()
    },

    handelChange(event) {
      const files = event.currentTarget.files
      const { type, size, name } = files[0]

      const extandName = name.replace(/^.+\./, '')
      console.info(type, name, extandName, size, this.maxFileSize)

      if (mediaTypes.indexOf(extandName) < 0) {
        this.$message({
          message: '请选择正确的文件上传',
          type: 'warning'
        })
        return false
      }

      if (size > this.maxFileSize) {
        this.$message({
          message: '请将文件控制在10240MB以下',
          type: 'warning'
        })
        return false
      }

      this.isUploading = true
      this.doUploadFile(files[0])
    },

    handelUploadSuccess(resStr, type) {
      let res = {}
      if (resStr) {
        res = JSON.parse(resStr)
      }

      const { code, data } = res
      if (code === 200) {
        const mediaItem = {
          attachmentUrl: data.attachmentUrl,
          attachmentType: type
        }
        this.contentForm.attachments.push(mediaItem)
      }
    },

    doUploadFile(file) {
      let type = ''
      if (file.type === 'video/mp4') {
        type = 'video'
      }
      if (file.type === 'audio/mpeg') {
        type = 'audio'
      }
      doUploadFile(file, (res) => {
        this.isUploading = false
        this.handelUploadSuccess(res, type)
      }, () => {
        this.isUploading = false
        this.$message({
          type: 'warning',
          message: '上传文件失败'
        })
      })
    },

    removeConfirm(index) {
      this.$confirm('确认要删除此文件?').then(() => {
        this.doRemoveFile(index)
      }).catch(() => {})
    },

    doRemoveFile(fileIndex) {
      this.contentForm.attachments.splice(fileIndex, 1)
    },

    updateSelectedTags(item, isAdd) {
      const { tagId } = item
      if (isAdd) {
        this.contentForm.slectedTags.push(tagId)
        this.tagsSelectedlist.push(item)
      } else {
        const index = this.contentForm.slectedTags.findIndex(tag => tag === tagId)
        if (index >= 0) {
          this.contentForm.slectedTags.splice(index, 1)
          this.tagsSelectedlist.splice(index, 1)
          this.tags.list.forEach(tag => {
            if (tag.tagId === tagId) {
              tag.checked = false
            }
          })
        }
      }
    },

    toggleTag(item) {
      item.checked = !item.checked
      this.updateSelectedTags(item, item.checked)
    },

    removeTag(item) {
      this.updateSelectedTags(item, false)
    },

    async loadTags() {
      const params = {
        size: this.tags.pageSize,
        current: this.tags.pageNo,
        tagName: this.tags.tagName
      }

      this.isLoading = true
      const res = await getList(params)
      this.isLoading = false

      this.tags.list = decorateTagList(res.data ? res.data.records : [], this.contentForm.slectedTags)
      this.tags.total = res.data.total || 0
    },

    async getKnowledgeDetail() {
      if (this.id !== '-1' && this.id !== -1) {
        this.isLoading = true
        const detailRes = await getDetail(this.id)
        this.isLoading = false
        const { data, code } = detailRes
        if (code === 200 && data) {
          const { title, detail, categories, attachments, searchTags } = data
          this.contentForm.title = title
          this.contentForm.detail = detail
          this.contentForm.selectedCategories = getSelectCategories(categories)
          this.contentForm.attachments = attachments
          this.contentForm.slectedTags = this.getSelectedTages(searchTags)
          this.tagsSelectedlist = searchTags
          this.tags.list = decorateTagsSelectedStatus(this.tags.list, this.contentForm.slectedTags)

          if (!this.isReadOnly) {
            this.editor.setContent(detail)
          }
        }
      }
    },

    getSelectedTages(searchTags) {
      const selectedTages = []
      searchTags.forEach(item => {
        selectedTages.push(item.tagId)
      })
      return selectedTages
    },

    async doPostContent() {
      const params = {
        title: this.contentForm.title,
        detail: this.contentForm.detail,
        attachments: this.contentForm.attachments
      }

      if (this.id !== '-1') {
        params['knowledgeId'] = this.id
      }

      if (this.contentForm.selectedCategories.length > 0) {
        const categories = []
        this.contentForm.selectedCategories.forEach(item => {
          if (item) {
            const category = {
              knowledgeId: this.id,
              categoryId: item
            }
            categories.push(category)
          }
        })
        params['categories'] = categories
      }

      if (this.contentForm.slectedTags.length > 0) {
        const searchTags = []
        this.contentForm.slectedTags.forEach(item => {
          const tag = {
            knowledgeId: this.id,
            tagId: item
          }
          searchTags.push(tag)
        })
        params['searchTags'] = searchTags
      }

      this.isLoading = true
      const res = await submitArticle(params)
      this.isLoading = false
      const { code } = res

      if (code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })

        this.$router.push({
          path: '/knowledge/content'
        })
      }
    },

    doSubmit() {
      // this.contentForm.detail = CKEDITOR.instances.editor.getData()
      this.contentForm.detail = this.editor.getContent()

      const validateRes = doValidate(this.contentForm)
      const { result, message } = validateRes

      if (result === true) {
        this.doPostContent()
      } else {
        this.$message({
          type: 'warngin',
          message
        })
      }
    },

    doPreview() {
      if (!this.id || this.id === '-1') {
        this.$message({
          showClose: true,
          message: '请先保存然后再预览',
          type: 'warning'
        })
        return false
      }
      window.open(`preview/index.html#/integrate?articleId=${this.id}&mode=0`)
    },

    getEditConfig() {
      // window['UEDITOR_CONFIG']['serverUrl'] = getEditorUploadUrl()
      // window['UEDITOR_CONFIG']['imageUrl'] = getEditorUploadUrl()
      const uploadUrl = getEditorUploadUrl()
      const apiHost = window['appInfo']['apiHost']

      const cfg = {
        serverUrl: uploadUrl,
        imageUrl: uploadUrl,
        imageActionName: 'uploadimage',
        imageFieldName: 'file',
        imageMaxSize: 1024 * 1000 * 500,
        imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
        imageCompressEnable: true,
        imageCompressBorder: 1600,
        imageInsertAlign: 'none',
        imageUrlPrefix: apiHost,
        fileUrlPrefix: apiHost,
        videoUrlPrefix: apiHost,
        catcherFieldName: 'file',
        catcherActionName: 'catcherImage',
        catcherLocalDomain: apiHost,
        catcherUrlPrefix: apiHost,
        imagePathFormat: ''
        // autoHeightEnabled: false,
        // minFrameHeight: 500
      }

      return cfg
    },

    handlePageChange(val) {
      this.tags.pageNo = val
      this.loadTags()
    },

    doSearchTags() {
      this.tags.pageNo = 1
      this.loadTags()
    }
  },

  created() {},

  destroyed() {
    if (this.editor) {
      this.editor.destroy()
    }
  },

  mounted() {
    if (this.isReadOnly !== true) {
      // setTimeout(() => {
      //   // CKEditorInit()
      // }, 500)
      this.editor = UE.getEditor('editor', this.getEditConfig())
      this.editor.ready(() => {
        this.init()
      })
    }
  }
}
</script>
