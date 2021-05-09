<template>
  <hf-ui-breadcrumb  separator="/" :class="[$store.state.appPrefix + '-c-bread']">
    <template v-for="(item, index) in breadData">
      <hf-ui-breadcrumb-item v-if="index !== breadData.length - 1 && item.hasChildren === false" :to="{path: item.menuUrl}" :key="item.id">{{ item.menuName }}</hf-ui-breadcrumb-item>
      <span v-else :key="item.id" class="hf-ui-breadcrumb__item">
        <span role="link" class="hf-ui-breadcrumb__inner">{{ item.menuName }}</span>
        <span role="presentation" class="hf-ui-breadcrumb__separator">/</span>
      </span>
    </template>
  </hf-ui-breadcrumb>
</template>
<script>
import { matchBreadData } from './models'

export default {
  name: 'PageBreadcrumbHeader',
  components: {},
  data() {
    return {
      breadData: []
    }
  },
  watch: {
    '$route.path'(val) {
      const meta = this.$route.meta
      const currentPath = meta.notMatchedMenu === true ? meta.menuPath : val
      this.breadData = matchBreadData(currentPath, this.$store.state.leftMenu.rawMenuList)
      if (meta.notMatchedMenu === true) {
        this.breadData.push({
          menuName: meta.title,
          id: 'not-matched-' + this.$route.name
        })
      }
    }
  },
  computed: {
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
};
</script>
