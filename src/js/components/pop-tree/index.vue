<template>
  <div :class="[$store.state.appPrefix + '-c-pop-tree', showTree ? 'is-focus' : '', disabled ? 'is-disabled' : '']" @click="toggleTree">
    <hf-ui-input v-model="value" :placeholder="$attrs.placeholder"></hf-ui-input>
    <div class="mask" @click="toggleTree"></div>
    <hf-ui-tree
      ref="lazyTree"
      :load="loadNode"
      lazy
      show-checkbox
      node-key="id"
      @check-change="handleCheckChange">
    </hf-ui-tree>
  </div>
</template>
<script>
import { getTree } from './models'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array],
      default: ''
    }
  },
  data() {
    return {
      // props: {
      //   label: 'name',
      //   children: 'zones'
      // },
      count: 1,
      showTree: false,
      currentNode: null,
      tree: [],
      checkedList: []
    };
  },

  methods: {
    handleCheckChange() {
      const keys = this.$refs.lazyTree.getCheckedKeys(true)
      // const nodes = this.$refs.lazyTree.getCheckedNodes(true)
      this.$emit('input', keys)
    },

    handleNodeClick() {
      // console.log(data);
    },

    async loadNode(node, resolve) {
      const res = await getTree(node)
      resolve(res.data)
    },

    toggleTree(event) {
      this.showTree = !this.showTree
      // console.info('this.showTree:', this.showTree)
      event.stopPropagation()
    }
  },

  created() {
    // this.loadNode(this.currentNode)
  },

  mounted() {}
};
</script>
