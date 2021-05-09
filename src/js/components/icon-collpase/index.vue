<template>
  <i
    class="hf-ui-icon"
    :class="domClass"
    :title="title"
    @click="toggleCollpase"></i>
</template>
<script>
export default {
  props: {
    defaultCollpase: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isCollpase: false,
    };
  },
  computed: {
    title() {
      return this.isCollpase ? '展开' : '收起';
    },
    domClass() {
      return this.isCollpase ? 'ui-icon-line-direction-down' : 'ui-icon-line-direction-up'
    },
  },
  methods: {
    toggleCollpase() {
      this.isCollpase = !this.isCollpase;
      this.$emit('changed', this.isCollpase);
    },
  },
  mounted() {
    this.isCollpase = this.defaultCollpase;
  }
};
</script>
