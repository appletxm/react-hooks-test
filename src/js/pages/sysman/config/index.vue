<template src="./template.html"></template>

<script>
import edit from './components/edit'
import { PAGE_CONFIG } from 'common/consts'
import listColumn from './columns'
import { getConfigList, delConfigs } from './models'

const defaultFormData = {
  configKey: '',
  configValue: '',
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
      list: [],
      listColumn: listColumn,
      selectedItems: [],
      sort: '',
      order: '',

      PAGE_CONFIG: PAGE_CONFIG,
      DEFAULT_PAGE_NO: PAGE_CONFIG.defaultPageNo,
      pageNo: PAGE_CONFIG.defaultPageNo,
      pageSize: PAGE_CONFIG.defaultPageSize,
      totalRecordCount: 0,

      dialogVisible: false,
      editId: ''
    };
  },
  methods: {
    $search() {
      this.$getList(this.DEFAULT_PAGE_NO);
    },
    $resetForm() {
      this.filterForm = { ...defaultFormData };
    },
    // 排序设置
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
      this.editId = row.id
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
        ids: this.selectedItems.map(m => m.id).join(','),
      };
      this.isListLoading = true;
      try {
        await delConfigs(params);
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
        this.$message.error(err.message || '删除配置出错');
      }
    },
    async $getList(pageNo) {
      this.pageNo = pageNo || this.pageNo;
      const filterForm = this.filterForm;
      const params = {
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        sort: this.sort,
        order: this.$getOrderType(this.order),
      };
      Object.assign(params, filterForm);
      this.isListLoading = true;
      try {
        const { data } = await getConfigList(params);
        this.isListLoading = false;
        this.list = data.list || [];
        this.totalRecordCount = data.totalCount;
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.message || '获取配置列表出错');
      }
    },
    $handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.$getList(this.DEFAULT_PAGE_NO);
    },
    $init() {
      this.$getList();
    },
  },
  created() {
    this.$init()
  },
};
</script>
