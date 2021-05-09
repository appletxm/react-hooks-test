<template>
  <div :class="$store.state.appPrefix + '-p-propaganda-admin'" v-loading="isLoading">
    <hf-ui-row class="search-header">
      <hf-ui-col :span="24">
        <hf-ui-form ref="searchForm" :model="searchForm"  label-width="auto">
          <hf-ui-form-item label="标题：">
            <hf-ui-input v-model="searchForm.title" placeholder="请输入标题"></hf-ui-input>
          </hf-ui-form-item>

          <!-- <hf-ui-form-item label="类型：">
            <pop-tree v-model="selectedCategories"></pop-tree>
          </hf-ui-form-item> -->

          <hf-ui-form-item label="创建时间：">
            <hf-ui-date-picker
              v-model="searchForm.date"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </hf-ui-date-picker>
          </hf-ui-form-item>
        </hf-ui-form>

        <div class="search-opt-btns">
          <hf-ui-button type="primary" @click="doSearch">搜索</hf-ui-button>
          <hf-ui-button type="secondary" icon="ui-icon-line-currency-addto" @click="handleNew">新增</hf-ui-button>
          <!-- <hf-ui-button type="secondary" icon="ui-icon-line-currency-down">导入</hf-ui-button> -->
        </div>
      </hf-ui-col>
    </hf-ui-row>

    <hf-ui-table :data="tableData" style="width: 100%" border>
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
    @current-change="handlePageChange"
    :total="totalCount">
  </hf-ui-pagination>
  </div>
</template>

<script>
import columns from './columns'
import { getCategoriesDict } from '../knowledge-category/models'
import { getList, decorateList, deleteContent } from './models'
// import PopTree from 'components/pop-tree'

export default {
  components: {
    // PopTree
  },
  data() {
    return {
      searchForm: {
        title: '',
        category: 'all',
        dateTime: ''
      },
      columns,
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 0,
      selectedCategories: []
    }
  },

  methods: {
    async loadContentlist() {
      const { currentPage } = this
      const { title, category, dateTime } = this.searchForm
      this.isLoading = true
      const res = await getList({
        current: currentPage,
        title,
        category,
        dateTime
      })
      this.isLoading = false
      const { data } = res
      const dict = await getCategoriesDict()
      this.tableData = decorateList(res.data.records || [], dict)
      this.totalCount = data.total
    },

    handleEdit(index, row) {
      this.$router.push({
        path: '/knowledge/content/edit',
        query: {
          id: row.knowledgeId
        }
      })
    },

    async doRemoveContent(index, row) {
      this.isLoading = true
      const res = await deleteContent(row.knowledgeId)
      this.isLoading = false
      const { code } = res
      if (code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })

        this.loadContentlist()
      }
    },

    handleDelete(index, row) {
      this.$confirm('确认要删除此内容?').then(() => {
        this.doRemoveContent(index, row)
      }).catch(() => {})
    },

    handleNew() {
      this.$router.push({
        path: '/knowledge/content/edit',
        query: {
          id: -1
        }
      })
    },

    init() {
      this.loadContentlist()
    },

    doSearch() {
      this.currentPage = 1
      this.loadContentlist()
    },

    handlePageChange(pageNo) {
      this.currentPage = pageNo
      this.loadContentlist()
    }
  },

  created() {
    this.init()
  }
}
</script>
