<template src="./list-code-template.html"></template>

<script>
import { PAGE_CONFIG } from 'common/consts'
import { getCodeList, delCodes } from './models'
import DictEdit from './componets/edit-code'

const defaultFormData = {
  codeNum: '',
  codeName: '',
};
export default {
  name: 'CodeList',
  data() {
    return {
      isPageLoading: false,
      isListLoading: false,
      isFilterCollpase: false,
      filterForm: { ...defaultFormData },
      list: [],
      selectedItems: [],
      pageconf: PAGE_CONFIG,
      defaultPageNo: PAGE_CONFIG.defaultPageNo,
      pageNo: PAGE_CONFIG.defaultPageNo,
      pageSize: PAGE_CONFIG.defaultPageSize,
      totalRecordCount: 0,
      sort: '',
      defaultSort: 'ascending',
      order: '',
      selectedId: '',
      codeTypeNum: '',
      dictId: '',
      isEditModel: false,
      isShowEditModal: false
    };
  },
  components: {
    DictEdit
  },
  methods: {
    $search() {
      this.$getList(this.defaultPageNo);
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

    $getOrderType(order) {
      if (!order) {
        return '';
      }

      return order.indexOf('asc') > -1 ? 'asc' : 'desc';
    },

    $add() {
      this.selectedId = ''
      this.isEditModel = false
      this.isShowEditModal = true
    },

    $edit(item) {
      this.selectedId = item.id
      this.isEditModel = true
      this.isShowEditModal = true
    },

    $delConfirm(item) {
      const title = '提示';
      let tips = `您共选中了 ${this.selectedItems.length} 条数据，删除后将无法恢复。确定吗？`;
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
      }).catch(() => {});
    },

    async $del() {
      const params = {
        ids: this.selectedItems.map(m => m.id).join(','),
      };
      this.isPageLoading = true;
      try {
        await delCodes(params)
        this.isPageLoading = false;
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
        this.selectedItems = [];
        this.getList();
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '删除用户出错！');
      }
    },

    selectionChange(val) {
      this.selectedItems = val;
    },

    async $getList(pageNo) {
      this.pageNo = pageNo || this.pageNo;

      const filterForm = this.filterForm;
      const params = {
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        sort: this.sort,
        order: this.$getOrderType(this.order),
        codeTypeNum: this.codeTypeNum,
      };

      Object.assign(params, filterForm);
      this.isListLoading = true;

      try {
        const { data } = await getCodeList(params);
        this.isListLoading = false;
        this.list = data.list || [];
        this.totalRecordCount = data.totalCount;
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.message || '获取字典列表出错！');
      }
    },

    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.$getList(this.defaultPageNo);
    },

    closeEditModal() {
      this.isShowEditModal = false
    },

    refreshData() {
      this.$getList()
    },

    $init() {
      const params = this.$route.params;
      this.codeTypeNum = params.codeTypeNum;
      this.dictId = params.id;
      this.$getList();
    }
  },
  mounted() {
    this.$init();
  },
};
</script>
