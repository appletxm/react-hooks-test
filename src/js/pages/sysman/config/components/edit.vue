<template>
  <el-dialog
    class="edit-dialog"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="$handleClose"
    :close-on-click-modal="false"
    append-to-body
    center
    width="600px">
    <el-form
      label-width="100px"
      size="small"
      ref="basicForm"
      v-loading="isLoading"
      :model="basicForm"
      :rules="rules">
      <el-form-item label="参数键名" prop="configKey">
        <el-input maxlength="100" v-model="basicForm.configKey" placeholder="请输入配置键名"></el-input>
      </el-form-item>
      <el-form-item label="参数键值" prop="configValue">
        <el-input maxlength="5000" type="textarea" :rows="3" v-model="basicForm.configValue" placeholder="请输入配置键值"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="sortNo">
        <el-input v-model="basicForm.sortNo" maxlength="9" placeholder="请输入排序号"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input maxlength="100" type="textarea" :rows="2" v-model="basicForm.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="g-c">
      <hf-ui-button @click="$handleClose">取 消</hf-ui-button>
      <hf-ui-button type="primary" @click="$submit">确 定</hf-ui-button>
    </div>
  </el-dialog>
</template>

<script>
import checkForm from 'mixins/checkform'
import { getConfig, updateConfig, addConfig } from '../models'

export default {
  name: 'ConfigEditComponent',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
  },
  mixins: [
    checkForm,
  ],
  computed: {
    dialogTitle() {
      return this.id ? '编辑配置' : '添加配置'
    }
  },
  watch: {
    'dialogVisible'(dialogVisible) {
      if (dialogVisible) {
        this.$init()
      }
    }
  },
  data() {
    const basicForm = {
      id: '',
      configKey: '',
      configValue: '',
      sortNo: '',
      remark: '',
    };
    return {
      isLoading: false,
      defaultBasicForm: { ...basicForm },
      basicForm: { ...basicForm },
      rules: {
        configKey: [
          { required: true, message: '请输入配置键名', trigger: 'blur' },
        ],
        configValue: [
          { required: true, message: '请输入配置键值', trigger: 'blur' },
        ],
        sortNo: [
          { pattern: /^[\d]+$/, message: '只能输入数字', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    $resetForm() {
      Object.assign(this.basicForm, this.defaultBasicForm);
      this.$refs.basicForm.resetFields()
    },
    $handleClose() {
      this.$resetForm()
      this.$emit('close-dialog')
    },
    async $submit() {
      if (this.isLoading) {
        return;
      }
      if (!this.$checkForm('basicForm')) {
        return;
      }
      const params = { ...this.basicForm }
      this.isLoading = true;
      try {
        let data;
        if (this.id) {
          data = await updateConfig(params);
        } else {
          delete params.id
          data = await addConfig(params);
        }
        this.isLoading = false;
        this.$emit('update-success')
        this.$message({
          message: data.retDesc,
          type: 'success',
          duration: 1000
        });
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '更新配置信息出错');
      }
    },
    async $getDetail() {
      const params = {
        id: this.id,
      };
      this.isLoading = true;
      try {
        const res = await getConfig(params);
        if (res.retCode === '000000') {
          Object.keys(this.basicForm).forEach(key => {
            this.basicForm[key] = res.data[key]
          })
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取配置详情出错');
      }
    },
    $init() {
      if (this.id) {
        this.$getDetail()
      }
    }
  }
};
</script>
