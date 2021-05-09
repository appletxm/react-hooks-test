<template src="./template.html"></template>

<script>
import AuthUser from './components/auth-user'
import { PAGE_CONFIG } from 'common/consts'
import { getAllMenuList } from 'components/left-menu/models'
import RoleEdit from './components/edit'
import { getRoleList, expireOrRecRole, delRoles } from './models'
import { listToTree } from 'utils/tree'
import { mapGetters } from 'vuex';

export default {
  name: 'role-index',
  components: {
    AuthUser,
    RoleEdit
  },
  data() {
    return {
      isPageLoading: false,
      isListLoading: false,
      activeId: '',
      editRoleId: '', // TODO why not use the activedId
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
      return this.isEditModel ? '修改角色' : '创建角色'
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
      this.editRoleId = ''
    },

    $edit(item) {
      this.isEditModel = true
      this.isShowEditModal = true
      this.editRoleId = item.id
    },

    closeEditModal() {
      this.isShowEditModal = false
    },

    refreshData(isAdd) {
      this.selectedItems = []
      this.$getList(isAdd ? this.defaultPageNo : null)
    },

    $toggleRoleConfirm(record) {
      const status = record.status;
      const title = '提示';
      const tips = `确认要 ${status === '0' ? '停用' : '启用'} 该角色吗？`;

      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$expireOrRecRole(record);
      }).catch(() => {});
    },

    async $expireOrRecRole(record) {
      const params = {
        id: record.id,
      };
      this.isPageLoading = true;
      try {
        await expireOrRecRole(params);
        this.isPageLoading = false;
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000
        });
        this.$getList();
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '停用/开启角色出错！');
      }
    },

    $delConfirm(item) {
      const title = '提示';
      let tips
      let ids
      if (item) {
        ids = item.id;
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
        const { retCode } = await delRoles(params);
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
        this.$message.error(err.message || '删除角色出错');
      }
    },

    $selectionChange(val) {
      this.selectedItems = val;
    },

    $chosRole(row) {
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
        const { data } = await getRoleList(params);
        this.isListLoading = false;
        this.list = data.list || [];
        this.totalRecordCount = data.totalCount;
        if (this.list.length > 0) {
          this.$chosRole(this.list[0]);
        }
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.message || '获取角色列表出错');
      }
    },

    async $getTree() {
      const params = {
        roleIds: this.activeId
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
