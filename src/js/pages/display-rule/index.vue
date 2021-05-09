<template>
  <div :class="$store.state.appPrefix + '-p-display-rule'" v-loading="isLoading">
    <hf-ui-row class="search-header">
      <hf-ui-col :span="24">
        <hf-ui-form ref="searchForm" :model="searchForm"  label-width="auto">
          <hf-ui-form-item label="标题：">
            <hf-ui-input v-model="searchForm.title" placeholder="请输入标题"></hf-ui-input>
          </hf-ui-form-item>

          <hf-ui-form-item label="播放时长：">
            <hf-ui-input v-model="searchForm.duration" placeholder="请输入播放时长"></hf-ui-input>
          </hf-ui-form-item>

          <hf-ui-form-item label="播放方式：">
            <hf-ui-select v-model="searchForm.screenSize">
              <hf-ui-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </hf-ui-option>
            </hf-ui-select>
          </hf-ui-form-item>
        </hf-ui-form>

        <div class="search-opt-btns">
          <hf-ui-button type="primary" @click="doSearch">搜索</hf-ui-button>
          <hf-ui-button type="secondary" icon="ui-icon-line-currency-addto" @click="handleNew">新增</hf-ui-button>
        </div>
      </hf-ui-col>
    </hf-ui-row>

    <hf-ui-table :data="list" style="width: 100%" border>
      <hf-ui-table-column v-for="(column, index) in columns"
        :key="'field_' + index"
        :prop="column.field"
        :label="column.label"
        :width="column.width">
      </hf-ui-table-column>
      <hf-ui-table-column label="操作">
        <template slot-scope="scope">
          <div class="btns">
            <hf-ui-button
              size="medium"
              @click="handleEdit(scope.$index, scope.row)">编辑</hf-ui-button>
            <hf-ui-button
              size="medium"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</hf-ui-button>
          </div>
        </template>
      </hf-ui-table-column>
    </hf-ui-table>

    <hf-ui-pagination
      v-if="totalCount > pageSize"
      layout="prev, pager, next, jumper, total"
      :page-size="pageSize"
      :current-change="handlePageChange"
      :total="totalCount">
    </hf-ui-pagination>

    <hf-ui-dialog
      title="编辑规则"
      :is-border="false"
      append-to-body
      :visible.sync="showEditDialog">
      <hf-ui-form ref="searchForm" :model="editForm"  label-width="auto">
        <hf-ui-form-item label="标题：">
          <hf-ui-input v-model="editForm.title" placeholder="请输入标题"></hf-ui-input>
        </hf-ui-form-item>

        <hf-ui-form-item label="播放时长：">
          <hf-ui-input v-model="editForm.duration" placeholder="请输入播放时长"></hf-ui-input>
        </hf-ui-form-item>

        <hf-ui-form-item label="播放方式：">
          <hf-ui-select v-model="editForm.screenSize">
            <hf-ui-option
              v-for="item in editOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </hf-ui-option>
          </hf-ui-select>
        </hf-ui-form-item>
      </hf-ui-form>
      <span slot="footer" class="dialog-footer">
        <hf-ui-button @click="showEditDialog = false">取 消</hf-ui-button>
        <hf-ui-button type="primary" @click="doEditRule">确 定</hf-ui-button>
      </span>
    </hf-ui-dialog>
  </div>
</template>

<script>
import { getRuleList, decorateData, deleteRule, doValidate, updateRule } from './models'
import columns from './columns'

const options = [
  {
    value: 0,
    label: '小尺寸'
  },

  {
    value: 1,
    label: '全屏'
  }
]

const editOptions = JSON.parse(JSON.stringify(options))

export default {
  data() {
    return {
      isLoading: false,
      columns,
      list: [],
      pageSize: 10,
      totalCount: 0,
      currentPage: 0,
      options,
      searchForm: {
        duration: null,
        title: '',
        screenSize: ''
      },

      editId: '',
      showEditDialog: false,
      editOptions,
      editForm: {
        duration: 300,
        title: '',
        screenSize: 0
      }
    }
  },

  methods: {
    doSearch() {
      this.currentPage = 1
      this.loadRules()
    },

    handlePageChange(pageNo) {
      this.currentPage = pageNo
      this.loadRules()
    },

    async loadRules() {
      const { currentPage } = this
      const { title, duration, screenSize } = this.searchForm

      this.isLoading = true

      const res = await getRuleList({
        title, currentPage, duration, screenSize
      })

      this.isLoading = false

      const { code } = res
      if (code === 200) {
        const { totalCount, data } = res
        this.totalCount = totalCount
        this.list = decorateData(data.list)
      }
    },

    init() {
      this.loadRules()
    },

    handleNew() {
      this.editId = ''
      this.editForm.title = ''
      this.editForm.duration = 20000
      this.editForm.screenSize = 0
      this.showEditDialog = true
    },

    handleEdit(index, row) {
      const { id, title, rule } = row
      const { duration, screenSize } = rule
      this.editId = id
      this.editForm.title = title
      this.editForm.duration = duration
      this.editForm.screenSize = screenSize
      this.showEditDialog = true
    },

    async doRemoveRule(index, row) {
      this.isLoading = true
      const res = await deleteRule(row.id)
      this.isLoading = false
      const { code } = res
      if (code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.loadRules()
      }
    },

    handleDelete(index, row) {
      this.$confirm('确认要删除此规则?').then(() => {
        this.doRemoveRule(index, row)
      }).catch(() => {})
    },

    async doUpdateRule() {
      this.isLoading = true
      const res = await updateRule()
      this.isLoading = false
      const { code } = res
      if (code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })

        if (!this.editId) {
          this.currentPage = 1
        }
        this.loadRules()
      }
    },

    doEditRule() {
      const res = doValidate(this.editForm)
      const { result, message } = res
      if (result) {
        this.doUpdateRule()
        this.showEditDialog = false
      } else {
        this.$message({
          type: 'warning',
          message
        })
      }
    }
  },

  created() {
    this.init()
  }
}
</script>
