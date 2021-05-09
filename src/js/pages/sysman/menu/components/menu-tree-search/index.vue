<template src="./template.html"></template>
<script>
import IconCollpase from 'components/icon-collpase'
import { getAllMenuList, getNormalMenuList } from 'components/left-menu/models'

export default {
  components: {
    IconCollpase
  },
  props: {
    title: {
      type: String,
      default: '提示',
    },
    id: {
      type: String,
      default: '',
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      treeForm: {
        id: '',
        menuName: '',
      },
      isFilterCollpase: false,
      filterText: '',
      sourceList: [],
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },
      selectedNode: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    id: {
      handler(id) {
        if (this.sourceList.length < 1) {
          return;
        }
        this.initSelect(id);
      },
      immediate: true,
    },
  },
  methods: {
    toggleContentCollpase(isCollpase, labelName) {
      this[labelName] = isCollpase;
    },
    initSelect(id) {
      this.treeForm.id = id;
      this.treeForm.menuName = this.sourceList.filter(item => item.id === id)
        .map(item => item.menuName)[0];
    },
    clearSearchData() {
      this.clear();
      this.$emit('clear');
    },
    clear() {
      this.treeForm.id = '';
      this.treeForm.menuName = '';
    },
    reload() {
      this.$init();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.menuName.indexOf(value) !== -1;
    },
    handleTreeClick(node) {
      this.selectedNode = node;
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit('cancel');
    },
    confirm() {
      const selectedNode = this.selectedNode;
      if (selectedNode) {
        this.treeForm.id = selectedNode.id;
        this.treeForm.menuName = selectedNode.menuName;
      } else {
        this.treeForm.id = '';
        this.treeForm.menuName = '';
      }

      this.dialogVisible = false;
      this.$emit('confirm', selectedNode);
    },
    async $getMenuTree() {
      try {
        const { data } = await getAllMenuList();
        this.sourceList = data || [];
        this.menuTree = getNormalMenuList(this.sourceList);
        this.initSelect(this.id);
      } catch (err) {
        this.menuTree = [];
        this.$message.error(err.message || '获取菜单树出错！');
      }
    },
    $init() {
      this.$getMenuTree();
    },
  },
  mounted() {
    this.$init()
  },
};
</script>
