<template src="./list-template.html"></template>

<script>
import edit from './components/edit'
import { PAGE_CONFIG, USER_STATUS } from 'common/consts'
import listColumn from './list-column'
import { getUserList, delUsers, getConfigVal, resetUserPwd, expireOrRecUser } from './models'

const defaultFormData = {
  account: '',
  name: '',
  isLocked: ''
};
export default {
  name: 'ConfigList',
  components: {
    edit
  },
  data() {
    return {
      isListLoading: false,
      filterForm: { ...defaultFormData },
      USER_STATUS: USER_STATUS,
      list: [],
      listColumn: listColumn,
      selectedItems: [],
      sort: '',
      order: '',
      defaultPwd: '000000',

      pageconf: PAGE_CONFIG,
      DEFAULT_PAGE_NO: PAGE_CONFIG.defaultPageNo,
      current: PAGE_CONFIG.defaultPageNo,
      size: PAGE_CONFIG.defaultPageSize,
      totalRecordCount: 0,

      dialogVisible: false,
      editId: ''
    };
  },

  filters: {
    convertUserStatus: function (status) {
      return USER_STATUS[status];
    }
  },
  methods: {
    $search() {
      this.$getList(this.DEFAULT_PAGE_NO);
    },
    $resetForm() {
      this.filterForm = { ...defaultFormData };
    },
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
    // 转换排序方式
    $getOrderType(order) {
      if (!order) {
        return '';
      }
      return order.indexOf('asc') > -1 ? 'asc' : 'desc';
    },
    $selectionChange(val) {
      this.selectedItems = val;
    },
    $add() {
      this.editId = ''
      this.dialogVisible = true
    },
    $edit(row) {
      this.editId = row.userId
      this.dialogVisible = true
    },
    $updateSuccess() {
      this.$closeDialog()
      this.$getList(this.DEFAULT_PAGE_NO)
    },
    $closeDialog() {
      this.editId = ''
      this.dialogVisible = false
    },
    $resetPwdConfirm(row) {
      const title = '提示';
      const tips = `确认要重置密码为默认密码 ${this.defaultPwd} 吗？`;
      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetPwd(row);
      }).catch(() => {});
    },
    async resetPwd(row) {
      const params = {
        userId: row.userId,
        password: this.defaultPwd
      };
      this.isListLoading = true;
      try {
        await resetUserPwd(params);
        this.isListLoading = false;
        this.$message({
          message: '重置密码成功',
          type: 'success',
          duration: 1000
        });
        this.$getList();
      } catch (err) {
        this.isListLoading = false;
        this.$message.error(err.retDesc || '重置密码出错');
      }
    },
    $delConfirm(item) {
      const title = '提示';
      let tips = `您共选中了 ${this.selectedItems.length} 条数据，删除后将无法恢复。
                    确定吗？`;
      if (item) {
        this.selectedItems = [item];
        tips = '删除后将无法恢复。确定删除吗？';
      }
      if (this.selectedItems.length < 1) {
        this.$message('请至少选中一条记录');
        return;
      }
      this.$confirm(tips, title, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$del();
      }).catch(() => {
        //
      });
    },
    async $del() {
      const params = {
        ids: this.selectedItems.map(m => m.userId).join(','),
      };
      this.isListLoading = true;
      try {
        await delUsers(params);
        this.isListLoading = false;
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
        this.selectedItems = [];
        this.$getList();
      } catch (err) {
        this.isListLoading = false;
        this.$message.error(err.retDesc || '删除用户出错');
      }
    },
    async $toggleUserStatus(row) {
      const params = {
        userId: row.userId,
        isLocked: row.isLocked === 0 ? 1 : 0
      };
      this.isListLoading = true;
      try {
        const { data } = await expireOrRecUser(params);
        this.isListLoading = false;
        this.$message({
          message: data.isLocked === 0 ? '账号启用' : '账号停用',
          type: 'success',
          duration: 1000
        });
        this.$getList();
      } catch (err) {
        this.isListLoading = false;
        this.$message.error(err.retDesc || '账号启用出错');
      }

    },
    async $getList(current) {
      this.current = current || this.current;
      const filterForm = this.filterForm;
      let params = {
        current: current || this.current,
        size: this.size,
        sort: this.sort,
        order: this.$getOrderType(this.order),
      };
      // 填入筛选项
      params = Object.assign(params, filterForm);
      this.isListLoading = true;

      try {
        const { data } = await getUserList(params);
        this.isListLoading = false;
        this.list = data.records || [];
        this.totalRecordCount = data.total;
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.retDesc || '获取用户列表出错');
      }
    },

    $handleSizeChange(newPageSize) {
      this.size = newPageSize;
      this.$getList(this.DEFAULT_PAGE_NO);
    },
    async $getDefaultPwd() {
      const params = {
        configKey: 'sys.user.default.pwd',
      };
      try {
        const { data } = await getConfigVal(params);
        if (data && data.configValue) {
          this.defaultPwd = data.configValue;
        }
      } catch (err) {
        this.$message.error(err.message || '获取系统密码出错！');
      }
    },

    $init() {
      this.$getList(this.current);
      // this.$getDefaultPwd();
    },
  },

  created() {
    this.$init()
  },
};
</script>
