<template src="./list-template.html"></template>

<script>
import { delMenus, expireOrRecMenu } from './models'
import { getAllMenuList, getNormalMenuList } from 'components/left-menu/models'
import { MENU_TYPE, MENU_BE_LONG_TYPE, MENU_STATE } from 'common/consts'
import MenuEdit from './components/edit'

const defaultFormData = {
  menuName: '',
  menuType: '',
  belongType: '',
  isShow: '',
}

export default {
  name: 'MenuList',
  components: {
    MenuEdit
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      isPageLoading: false,
      isListLoading: false,
      isFilterCollpase: false,
      filterForm: { ...defaultFormData },
      list: [],

      totalRecordCount: 0,
      menuTypeMap: MENU_TYPE,
      menuBelongTypeMap: MENU_BE_LONG_TYPE,
      menuIsShowMap: MENU_STATE,
      selectedNodeParentId: '',
      selectedNodeId: '',
      defaultExpandKeys: [],

      isShowEditMenuItem: false,
      isEditModel: false
    };
  },
  computed: {
    title() {
      return this.isEditModel ? '编辑菜单' : '新增菜单';
    }
  },
  methods: {
    $search() {
      this.$getList();
    },
    $resetForm() {
      this.filterForm = { ...defaultFormData };
    },
    $edit(item) {
      this.isEditModel = true
      this.selectedNodeId = item.id
      this.selectedNodeParentId = item.parentId
      this.isShowEditMenuItem = true
    },
    $add(item) {
      this.isEditModel = false
      this.selectedNodeParentId = item ? item.id : '0'
      this.selectedNodeId = ''
      this.isShowEditMenuItem = true
    },

    $delConfirm(item) {
      const title = '提示'
      let tips = '删除后将无法恢复。确定删除吗？'
      if (item.children && item.children.length > 0) {
        tips = '删除此菜单时，连同子菜单也会一起删除。确定删除吗？';
      }
      this.$confirm(tips, title, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$del(item);
      }).catch(() => {})
    },

    $toggleMenuStatus(record) {
      const status = record.status + '';
      const title = '提示';
      const tips = `确认要 ${status === '0' ? '停用' : '启用'} 该菜单吗？`;

      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$expireOrRecMenu(record);
      }).catch(() => {})
    },

    async $expireOrRecMenu(record) {
      const params = {
        id: record.id,
      };

      this.isPageLoading = true;
      try {
        await expireOrRecMenu(params);
        this.isPageLoading = false;
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000
        });
        this.$getList();
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '停用/开启菜单出错！');
      }
    },

    async $getList() {
      const params = { pageSize: 99999, ...this.filterForm }
      this.isListLoading = true;

      try {
        const { data } = await getAllMenuList(params);
        this.defaultExpandKeys = []
        this.isListLoading = false;

        this.list = data || []
        if (this.filterForm.menuName || this.filterForm.menuType || this.filterForm.isShow) {
          this.defaultExpandKeys = this.list.map((item) => item.id)
        }
        this.list = getNormalMenuList(data)
      } catch (err) {
        this.list = [];
        this.isListLoading = false;
        this.$message.error(err.message || '获取菜单列表出错！');
      }
    },

    async $del(item) {
      const params = {
        ids: item.id,
      };
      this.isPageLoading = true;
      try {
        const { retCode } = await delMenus(params);
        this.isPageLoading = false;
        if (retCode === '000000') {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        }
        this.$getList();
      } catch (err) {
        this.isPageLoading = false;
        this.$message.error(err.message || '删除菜单出错！');
      }
    },

    refreshData() {
      this.$getList();
    },

    $init() {
      this.$getList();
    },

    closeEditModal() {
      this.isShowEditMenuItem = false
    }
  },
  created() {
    this.$init()
  },
  mounted() {}
}
</script>
