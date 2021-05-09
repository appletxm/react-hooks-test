<template>

  <div :class="$store.state.appPrefix + '-p-propaganda-admin'" v-loading="isLoading">
    <hf-ui-row class="search-header">
      <hf-ui-col :span="24">
        <div class="department-action">
          <hf-ui-button type="secondary" @click="$add"><span class="ui-icon-line-currency-addto"></span>添加部门</hf-ui-button>
          <hf-ui-button v-if="$hasPermission('department--del')" size="medium" type="important" @click="$delConfirm(null)" :disabled="selectedItems.length < 1">删除</hf-ui-button>
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
      <hf-ui-table-column
        prop="isLocked"
        label="部门状态"
        width="110">
        <template slot-scope="scope">
          {{ scope.row.isLocked | convertUserStatus | filterBlank }}
        </template>
      </hf-ui-table-column>

      <hf-ui-table-column label="操作">
        <template slot-scope="scope">
          <div class="btns">
            <hf-ui-button
              size="medium"
              @click="$edit(scope.row)">编辑</hf-ui-button>
            <hf-ui-button
              @click="$toggleDepartmentConfirm(scope.row)"
              size="medium">{{scope.row.isLocked == 0 ? '停用' : '启用'}}
            </hf-ui-button>
            <!-- <hf-ui-button
              size="medium"
              type="danger"
              @click="$delConfirm(scope.row)">删除</hf-ui-button> -->
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
    :title="editTitle"
    :visible.sync="isShowEditModal"
    :append-to-body="true"
    width="950px"
    height="90%"
    center>

    <department-edit
    :departmentId="editDepartmentId"
    :is-edit-model="isEditModel"
    :toggle-ctrl="isShowEditModal"
    @close="closeEditModal"
    @refresh-data="refreshData"
    ></department-edit>
  </hf-ui-dialog>
  </div>
</template>

<script>
import { PAGE_CONFIG, DEPARTMENT_STATUES } from 'common/consts'
import { getAllMenuList } from 'components/left-menu/models'
import DepartmentEdit from './components/edit'
import { getDepartmentList, expireOrRecDepartment, delDepartments } from './models'
import { listToTree } from 'utils/tree'
import { mapGetters } from 'vuex';
import columns from './columns'

export default {
  name: 'department-index',
  components: {
    DepartmentEdit
  },
  data() {
    return {
      isPageLoading: false,
      isListLoading: false,
      activeId: '',
      editDepartmentId: '', // TODO why not use the activedId
      columns,
      list: [],
      selectedItems: [],
      sort: '',
      order: '',

      pageSizeR: 10,
      totalRecordCountR: 0,
      pageNoR: PAGE_CONFIG.defaultPageNo,
      pageconf: PAGE_CONFIG,
      defaultPageNo: PAGE_CONFIG.defaultPageNo,
      pageNo: PAGE_CONFIG.defaultPageNo,
      pageSize: 10,
      totalRecordCount: 0,

      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },

      isTreeLoaing: false,
      isEditModel: false,
      isShowEditModal: false
    };
  },
  computed: {
    ...mapGetters([
      'isAdmin',
    ]),
    firstId() {
      let temp = null;
      if (this.list.length > 0) {
        temp = this.list[0].id;
      }
      return temp;
    },
    editTitle() {
      return this.isEditModel ? '修改部门' : '添加部门'
    }
  },
  filters: {
    convertUserStatus: function (status) {
      return DEPARTMENT_STATUES[status];
    }
  },
  methods: {
    $setSort(obj) {
      if (obj.order) {
        this.sort = obj.prop;
        this.order = this.$getOrderType(obj.order);
      } else {
        this.sort = '';
        this.order = '';
      }
      this.$getList();
    },

    $getOrderType(order) {
      if (!order) {
        return '';
      }
      return order.indexOf('asc') > -1 ? 'asc' : 'desc';
    },

    $add() {
      this.isEditModel = false
      this.isShowEditModal = true
      this.editDepartmentId = ''
    },

    $edit(item) {
      this.isEditModel = true
      this.isShowEditModal = true
      this.editDepartmentId = item.departmentId
    },

    closeEditModal() {
      this.isShowEditModal = false
    },

    refreshData(isAdd) {
      this.selectedItems = []
      this.$getList(isAdd ? this.defaultPageNo : null)
    },

    $toggleDepartmentConfirm(record) {
      const isLocked = record.isLocked;
      const title = '提示';
      const tips = `确认要 ${isLocked === 0 ? '停用' : '启用'} 该部门吗？`;

      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$expireOrRecDepartment(record);
      }).catch(() => {});
    },

    async $expireOrRecDepartment(record) {
      const params = {
        departmentId: record.departmentId,
      };
      this.isPageLoading = true;
      try {
        await expireOrRecDepartment(params);
        this.isPageLoading = false;
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000
        });
        this.$getList();
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '停用/开启部门出错！');
      }
    },

    $delConfirm(item) {
      const title = '提示';
      let tips
      let ids
      if (item) {
        ids = item.departmentId;
        tips = '删除后将无法恢复。确定删除吗？';
      } else {
        if (this.selectedItems.length < 1) {
          this.$message('请至少选中一条记录');
          return;
        }
        tips = `您共选中了 ${this.selectedItems.length} 条数据，删除后将无法恢复。确定吗？`;
        ids = this.selectedItems.map(m => m.id).join(',')
      }
      this.$confirm(tips, title, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$del(ids);
      }).catch(() => {});
    },

    async $del(ids) {
      const params = { ids };
      this.isPageLoading = true;
      try {
        const { retCode } = await delDepartments(params);
        this.isPageLoading = false;
        if (retCode === '000000') {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        }
        this.selectedItems = [];
        this.$getList(this.defaultPageNo);
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '删除部门出错');
      }
    },

    $selectionChange(val) {
      this.selectedItems = val;
    },

    $chosDepartment(row) {
      if (row && row.id) {
        if (this.activeId === row.id) {
          return
        }
        this.activeId = row.id;
        this.$getTree();
      }
    },

    async $getList(pageNo) {
      this.pageNoR = pageNo || this.pageNoR;
      const params = {
        sort: this.sort,
        order: this.$getOrderType(this.order),
        pageNo: pageNo || this.pageNoR,
        pageSize: this.pageSizeR,
      };
      this.isListLoading = true;
      try {
        const { data } = await getDepartmentList(params);
        this.isListLoading = false;
        this.list = data.records || [];
        this.totalRecordCount = data.totalCount;
        if (this.list.length > 0) {
          this.$chosDepartment(this.list[0]);
        }
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.message || '获取部门列表出错');
      }
    },

    async $getTree() {
      const params = {
        departmentIds: this.activeId
      };
      this.isTreeLoaing = true;
      try {
        const { data } = await getAllMenuList(params);
        const tempList = data || [];
        this.menuTree = listToTree([...tempList]);
        this.isTreeLoaing = false;
      } catch (err) {
        this.isTreeLoaing = false;
        this.menuTree = [];
        this.$message.error(err.message || '获取菜单树出错');
      }
    },

    $init() {
      this.$getList(this.defaultPageNo);
    }
  },

  created() {
    this.$init();
  },

  mounted() {
  }
};
</script>
