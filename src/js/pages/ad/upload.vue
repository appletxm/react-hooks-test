<template>
  <section :class="$store.state.appPrefix + '-p-ad-upload'">
    <div class="current-img">
      <img v-if="!noImage" :src="imgUrl" @load="handleLoadSuccess" @error="hadleLoadError" width="472">
    </div>

    <hf-ui-upload
      class="upload-demo"
      name="file"
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :file-list="fileList"
    >
      <hf-ui-button type="primary">点击上传</hf-ui-button>
      <div slot="tip" class="hf-ui-upload-tip">只能上传jpeg|jpg|png文件，且不超过500kb</div>
    </hf-ui-upload>
  </section>
</template>

<script>
import apiUrls from 'common/api-urls'

const { apiHost, uploadImagePrefix } = window.appInfo
const imgUrl = apiHost + uploadImagePrefix + '/ad.jpeg'

export default {
  components: {},
  data() {
    return {
      limit: 500,
      fileList: [],
      imgUrl,
      maxSize: 500 * 1024,
      uploadUrl: apiUrls.uploadAd,
      noImage: false
    }
  },
  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleBeforeUpload(file) {
      const { maxSize } = this
      // console.info('file:', (file.size / 1024) <= maxSize, (/^.+\.(jpeg|jpg|png)$/).test(file.name))

      const isSizeOk = (file.size / 1024) <= maxSize
      const isFileTypeOk = (/^.+\.(jpeg|jpg|png)$/).test(file.name)

      if (!isSizeOk) {
        this.$message.warning('文件大小已经大于 500Kb')
      }

      if (!isFileTypeOk) {
        this.$message.warning('文件不是jpeg/jpg/png')
      }

      return isSizeOk && isFileTypeOk
    },

    handleExceed(files) {
      this.$message.warning(`最多还可以上传 ${this.limit - this.fileList.length} 个文件，本次选择了 ${files.length} 个文件，请重新选择`);
    },

    hadleLoadError() {
      this.noImage = true
    },

    handleLoadSuccess() {
      this.noImage = false
    },

    handleUploadSuccess() {
      this.noImage = false
      // this.$router.replace(this.$route.path)
      window.location.reload()
    }
  }
}
</script>
