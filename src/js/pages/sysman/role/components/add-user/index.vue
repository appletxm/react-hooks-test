<template src="./template.html"></template>

<script>
import { PAGE_CONFIG } from 'common/consts'
import { getRoleUserList } from '../../models';

export default {
  props: {
    // 当前角色/用户组id
    id: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      isLoading: false,
      userList: [],
      addUserIds: [],
      rmUserIds: [],
      dialogVisible: false,
      titleArr: [
        { label: '账号名', prop: 'username', isArr: false },
        { label: '用户名', prop: 'truename', isArr: false },
      ],
      searchType: 'username', // truename
      searchVal: '',
      sort: '',
      order: '',

      PAGE_CONFIG: PAGE_CONFIG,
      DEFAULT_PAGE_NO: PAGE_CONFIG.defaultPageNo,
      pageNo: PAGE_CONFIG.defaultPageNo,
      pageSize: PAGE_CONFIG.defaultPageSize,
      totalCount: 0,
    };
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
      this.$getRoleUserList(this.DEFAULT_PAGE_NO);
    },
    $getOrderType(order) {
      if (!order) {
        return '';
      }
      return order.indexOf('asc') > -1 ? 'asc' : 'desc';
    },
    $submit() {
      this.dialogVisible = false;
      this.$emit('change', { addlist: this.addUserIds, rmList: this.rmUserIds });
    },

    async $getRoleUserList(pageNo) {
      this.pageNo = pageNo || this.pageNo;
      const params = {
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        isOnly: 2, // 1是2否 是否只查询该角色下的用户集
        sort: this.sort,
        order: this.$getOrderType(this.order),
      };
      params.roleId = this.id;
      params[this.searchType] = this.searchVal;
      this.isLoading = true;
      try {
        const { data: { list, totalCount } } = await getRoleUserList(params);
        this.totalCount = totalCount
        this.userList = list || [];
        this.$nextTick(function () {
          this.$initSelection(this.userList);
        });
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$message.error(error.message || '获取角色详情出错');
      }
    },
    $initSelection(list) {
      if (this.addUserIds.length > 0) {
        this.addUserIds = list.map((item) => item.id).filter((item) => this.addUserIds.indexOf(item) !== -1)
      }
      if (this.rmUserIds.length > 0) {
        this.rmUserIds = list.map(item => item.id).filter(item => this.rmUserIds.indexOf(item.id) !== -1)
      }
      list.forEach(item => {
        // 列表中已选 或 用户点击选中的 且 不在删除列表里
        if ((item.selected === '1' || this.addUserIds.includes(item.id))
        && !this.rmUserIds.includes(item.id)) {
          this.$refs.userListTable.toggleRowSelection(item, true);
        } else {
          this.$refs.userListTable.toggleRowSelection(item, false);
        }
      });
    },
    $selectionChange(val) {
      if (this.addUserIds.length <= this.userList.length) {
        this.addUserIds = val.map(i => i.id);
        this.rmUserIds = [];
      }
    },
    $handleSelectionChange(selection, row) {
      const selectedUserIds = selection.map(i => i.id);
      const curId = row.id;
      const isCurIntSelected = row.selected === '1';

      // 是选中
      if (selectedUserIds.includes(curId)) {
        // 在拿过来的列表里是没选中的,才塞入addUserIds
        if (!isCurIntSelected) {
          this.addUserIds.push(curId);
        }

        // 从删除列表中移除
        this.rmUserIds = this.rmUserIds.filter(i => i !== curId);
      } else {
      // 是取消
        // 在拿过来的列表里是选中的,才塞入rmUserIds
        if (isCurIntSelected) {
          this.rmUserIds.push(curId);
        }

        // 从添加列表中移除
        this.addUserIds = this.addUserIds.filter(i => i !== curId);
      }
    },
    $handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.$getRoleUserList(this.DEFAULT_PAGE_NO);
    }
  },
};
</script>
