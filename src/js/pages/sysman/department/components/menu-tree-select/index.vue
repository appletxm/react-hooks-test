<template>
 <hf-ui-tree
    ref="menuTree"
    node-key="resourceId"
    show-checkbox
    highlight-current
    :default-expand-all="defaultExpandAll"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    :data="menuTree"
    :props="defaultProps">
  </hf-ui-tree>
</template>
<script>
import { getAllMenuTree } from 'components/left-menu/models'
// import { listToTree } from 'utils/tree'

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
        label: 'name',
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
        // menuIdList: this.$refs.menuTree.getCheckedKeys(),
        // menuParentIds: this.$getParentIds(this.$refs.menuTree.getCheckedNodes()),
        menuIdList: this.$getMenuIds(),
      };
      this.$emit('changed', keys);
      // console.info(keys)
    },
    $getMenuIds() {
      let menuIdList = this.$refs.menuTree.getCheckedKeys()
      const arr = this.$refs.menuTree.getCheckedNodes()

      arr.forEach(item => {
        // console.info(item)
        if (item.parentId !== 0) {
          menuIdList = menuIdList.concat(item.parentId);
        }

      });
      return Array.from(new Set(menuIdList));
    },
    $clear() {
      this.$refs.menuTree.setCheckedKeys([]);
    },
    async $getTree() {
      try {
        const { data } = await getAllMenuTree();
        this.menuTree = data || [];
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
