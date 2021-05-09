<template>
  <div :class="$store.state.appPrefix + '-p-content-tree'" v-loading="isLoading">
    <hf-ui-input
    v-if="data.length > 0"
    placeholder="输入关键字进行过滤"
    v-model="filterText">
    </hf-ui-input>

    <div class="input-root">
      <hf-ui-button
      @click="() => append()">
      <i class="ui-icon-line-currency-addto"></i>
      添加内容体系
    </hf-ui-button>
    </div>

    <hf-ui-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :empty-text="''"
      ref="tree">

    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <hf-ui-button
            size="small"
            @click="($event) => editTreeNode($event, data, true)">
            <!--i class="ui-icon-line-currency-addto"></i-->
            添加下级项
          </hf-ui-button>
          <hf-ui-button
            size="small"
            @click="($event) => editTreeNode($event, data)">
            <!--i class="ui-icon-line-currency-upload"></i-->
            修改
          </hf-ui-button>
          <hf-ui-button
            size="small"
            @click="($event) => remove($event, node, data)">
            <!--i class="ui-icon-line-currency-close"></i-->
            删除
          </hf-ui-button>
        </span>
      </span>

    </hf-ui-tree>

  </div>
</template>

<script>
import { getCategory, addCategory, updateCategory, removeCategory } from './models'

export default {
  data() {
    return {
      isLoading: false,
      filterText: '',
      data: [],
      categoryName: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        dialogVisible: false
      }
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  async created() {
    this.isLoading = true
    const res = await getCategory()
    if (res && res.data) {
      this.data = res.data
      this.isLoading = false
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    editTreeNode(event, node, isNew) {
      this.$prompt('请输入内容章节', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: isNew ? '' : node.name,
        inputPattern: /^[\u4e00-\u9fa5\w\d_]{2,20}$/,
        inputErrorMessage: '请输入正确的内容章节'
      }).then(({ value }) => {
        if (isNew) {
          this.doAppend(node || { id: null }, value)
        } else {
          this.doUpdate(node, value)
        }
      }).catch(() => {})

      event.stopPropagation()
    },

    append(node) {
      this.$prompt('请输入内容章节', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5\w\d_]{2,20}$/,
        inputErrorMessage: '请输入正确的内容章节添'
      }).then(({ value }) => {
        this.doAppend(node || { id: null }, value)
      }).catch(() => {})
    },

    async doAppend(node, value) {
      const { categoryId } = node
      this.isLoading = true
      const res = await addCategory(categoryId, value)
      this.isLoading = false
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '你的内容章节添加成功'
        })

        const newItem = {
          categoryId: res.data.categoryId,
          name: res.data.name,
          children: []
        }

        if (!node.categoryId) {
          this.data.unshift(newItem)
          return
        }

        if (!node.children) {
          this.$set(node, 'children', [])
        }

        node.children.push(newItem)
      }
    },

    // update(node) {
    //   this.$prompt('请输入类型名', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputValue: node.name,
    //     inputPattern: /^[\u4e00-\u9fa5\w\d_]{2,20}$/,
    //     inputErrorMessage: '请输入正确的内容章节'
    //   }).then(({ value }) => {
    //     this.doUpdate(node, value)
    //   }).catch(() => {})
    // },

    async doUpdate(node, value) {
      const { categoryId } = node
      this.isLoading = true
      const res = await updateCategory(categoryId, value)
      this.isLoading = false
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '你的内容章节修改成功'
        })
        node.name = value;
      }
    },

    remove(event, node, data) {
      this.$confirm('您确认要删除该类别?').then(() => {
        this.doRemove(node, data)
      }).catch(() => {})

      event.stopPropagation()
    },

    async doRemove(node, data) {
      this.isLoading = true
      const res = await removeCategory(data.categoryId)
      this.isLoading = false

      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '你的内容章节删除成功'
        })

        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.categoryId === data.categoryId);
        children.splice(index, 1);
      }
    }

    // renderContent(h, { node, data, store }) {
    //   return (
    //       <span class="custom-tree-node">
    //         <span>{node.label}</span>
    //         <span>
    //           <hf-ui-button size="small" type="secondary" on-click={ () => this.append(data) }>Append</hf-ui-button>
    //           <hf-ui-button size="small" type="secondary" on-click={ () => this.remove(node, data) }>Delete</hf-ui-button>
    //         </span>
    //       </span>);
    // }
  }
};
</script>
