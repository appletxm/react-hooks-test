<template>
 <el-tree
    ref="menuTree"
    node-key="id"
    show-checkbox
    highlight-current
    :default-expand-all="defaultExpandAll"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    :data="menuTree"
    :props="defaultProps">
  </el-tree>
</template>
<script>
import { getAllMenuList } from 'components/left-menu/models'
import { listToTree } from 'utils/tree'

export default {
  props: {
    defaultExpandedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sourceList: [],
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        disabled(data, node) {
          // 为1的是停用的 不可选
          return node.data.status === 1;
        },
      },
    };
  },
  watch: {
    defaultCheckedKeys: {
      handler: function (val) {
        if (val.length <= 0) {
          this.$refs.menuTree.setCheckedKeys([]);
        }
      },
      deep: true
    }
  },
  methods: {
    $getCheckedKeys() {
      const keys = {
        menuIdList: this.$refs.menuTree.getCheckedKeys(),
        menuParentIds: this.$getParentIds(this.$refs.menuTree.getCheckedNodes()),
      };
      this.$emit('changed', keys);
    },
    $getParentIds(arr) {
      let parentIds = [];
      arr.forEach(item => {
        parentIds = parentIds.concat(item.parentIds.split(','));
      });
      return Array.from(new Set(parentIds));
    },
    $clear() {
      this.$refs.menuTree.setCheckedKeys([]);
    },
    async $getTree() {
      try {
        const { data } = await getAllMenuList();
        this.sourceList = data || [];
        this.menuTree = listToTree([...this.sourceList]);
      } catch (err) {
        this.menuTree = [];
        this.$message.error(err.message || '获取菜单树出错');
      }
    },
    init() {
      this.$getTree();
    },
  },
  created() {
    this.init();
  },
};
</script>
