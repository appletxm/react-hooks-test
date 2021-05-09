<template src="./template.html"></template>

<script>
import AddUser from '../add-user';
import { PAGE_CONFIG } from 'common/consts'
import { getRoleUserList, putUserIn } from '../../models';

export default {
  components: {
    AddUser
  },
  props: {
    // 角色id
    id: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      isListLoaing: false,
      userList: [],
      searchTypeList: [
        {
          label: '账号名',
          value: 'username',
        },
        {
          label: '用户名',
          value: 'truename',
        }
      ],
      searchType: 'username', // truename
      searchVal: '',
      selectedItems: [],
      sort: '',
      order: '',

      PAGE_CONFIG: PAGE_CONFIG,
      DEFAULT_PAGE_NO: PAGE_CONFIG.defaultPageNo,
      pageNo: PAGE_CONFIG.defaultPageNo,
      pageSize: 10,
      totalCount: 0,
    };
  },
  watch: {
    id: {
      handler(val) {
        if (!val) {
          return;
        }
        this.$getUserList(this.DEFAULT_PAGE_NO);
      },
      immediate: true,
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
      this.$getUserList(this.DEFAULT_PAGE_NO);
    },
    $getOrderType(order) {
      if (!order) {
        return '';
      }
      return order.indexOf('asc') > -1 ? 'asc' : 'desc';
    },
    $userSelChange(val) {
      this.selectedItems = val;
    },
    $delConfirm() {
      const title = '提示';
      const tips = `您共选中了 ${this.selectedItems.length} 个用户，删除后将无法恢复。确定吗？`;
      if (this.selectedItems.length < 1) {
        this.$message('请至少选中一个用户');
        return;
      }
      this.$confirm(tips, title, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$putUserIn();
      }).catch(() => {});
    },
    async $getUserList(pageNo) {
      this.pageNo = pageNo || this.pageNo;
      const params = {
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        isOnly: 1, // 1是2否 是否只查询该角色下的用户集
        sort: this.sort,
        order: this.$getOrderType(this.order),
      };
      params.roleId = this.id;
      params[this.searchType] = this.searchVal;
      this.isListLoaing = true;
      try {
        const { data: { list, totalCount } } = await getRoleUserList(params);
        this.userList = list || [];
        this.selectedItems = [];
        this.totalCount = totalCount
        this.isListLoaing = false;
      } catch (error) {
        this.isListLoaing = false;
        this.$message.error(error.message || '获取角色详情出错');
      }
    },
    // 添加用户
    $changeUser(obj) {
      this.$putUserIn('add', obj);
    },
    // 为角色分配用户
    async $putUserIn(type, ob) {
      const params = { id: this.id };
      const addUserIds = 'addUserIds';
      const rmUserIds = 'rmUserIds';
      if (type === 'add') {
        params[addUserIds] = ob.addlist;
        if (ob.rmList && ob.rmList.length > 0) {
          params[rmUserIds] = ob.rmList;
        }
      } else {
        params[rmUserIds] = this.selectedItems.map(item => item.id);
      }
      this.isListLoaing = true;
      try {
        await putUserIn(params);
        this.isListLoaing = false;
        if (type === 'add') {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          });
        } else {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.selectedItems = [];
        }
        this.$getUserList(this.DEFAULT_PAGE_NO);
      } catch (err) {
        let typeParams = '删除';
        if (type === 'add') {
          typeParams = '添加';
        }
        this.isListLoaing = false;
        this.$message.error(err.message || typeParams + '用户出错');
      }
    }
  },
};
</script>
