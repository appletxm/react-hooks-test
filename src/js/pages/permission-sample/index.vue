<template>
  <div>
    <hf-ui-button type="secondary" :disabled="!canAdd">新增功能的按钮</hf-ui-button>
    <hf-ui-button type="secondary" :disabled="!canEdit">修改功能的按钮</hf-ui-button>
    <hf-ui-button type="secondary" :disabled="!canDelete">删除功能的按钮</hf-ui-button>

    <hf-ui-search
      v-model="serachValue"
      is-basic
      @search="search"
      :default-keyword="keyword"
      placeholder="请输入关键字"
      :width="300"
    >
    </hf-ui-search>
  </div>
</template>

<script>
import { permission } from 'mixins/permission'

export default {
  data() {
    return {
      title: '',
      canAdd: false,
      canEdit: false,
      canDelete: false,
      serachValue: '',
      keyword: '生日蛋糕'
    }
  },

  mixins: [permission],

  created() {
    this.canAdd = this.$hasPermission('only-leaf--add')
    this.canEdit = this.$hasPermission('only-leaf--edit')
    this.canDelete = this.$hasPermission('only-leaf--del')
  },

  methods: {
    search(val) {
      console.info('search event:', val)
    }
  }
}
</script>
