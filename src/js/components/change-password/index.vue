<template>
  <hf-ui-dialog
    title="修改密码"
    :close-on-click-modal="false"
    @close="closeDialog"
    :visible.sync="showChangePassword">
    <hf-ui-form
      labhf-ui-width="100px"
      size="small"
      ref="passForm"
      v-loading="isLoading"
      :model="passForm"
      :rules="passFormValidate">
      <div class="edit-cell">
        <hf-ui-form-item label="旧密码" prop="oldPass" :error="passFormValidate.oldPass">
          <hf-ui-input v-model="passForm.oldPass" maxlength="20" placeholder="请输入旧密码"></hf-ui-input>
        </hf-ui-form-item>
        <hf-ui-form-item label="新密码" prop="newPass" :error="passFormValidate.newPass">
          <hf-ui-input v-model="passForm.newPass" maxlength="20" placeholder="请输入新密码"></hf-ui-input>
        </hf-ui-form-item>
        <hf-ui-form-item label="确认密码" prop="confrimPass" :error="passFormValidate.confrimPass">
          <hf-ui-input v-model="passForm.confrimPass" maxlength="20" placeholder="请确认新密码"></hf-ui-input>
        </hf-ui-form-item>
      </div>
    </hf-ui-form>

    <span slot="footer" class="dialog-footer">
      <hf-ui-button @click="closeDialog">取 消</hf-ui-button>
      <hf-ui-button type="primary" @click="doChangePass">确 定</hf-ui-button>
    </span>
  </hf-ui-dialog>
</template>

<script>
import { modifyPassword } from './models'

export default {
  name: 'ChangePassword',
  components: {},
  props: {
    showChangePassword: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    showChangePassword(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.passForm.resetFields()
        })
      }
    }
  },

  data() {
    return {
      isLoading: false,
      passForm: {
        oldPass: '',
        newPass: '',
        confrimPass: ''
      },
      passFormValidate: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ],
        confrimPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    validatePass(rule, value, callback) {
      if (!this.passForm.newPass || !this.passForm.confrimPass) {
        callback()
      } else if (this.passForm.newPass !== this.passForm.confrimPass) {
        callback(new Error('两次输入密码不一致!'))
      }
    },

    closeDialog() {
      this.$emit('close')
    },

    postChangePass() {
      modifyPassword({
        oldPassword: this.passForm.oldPass,
        newPassword: this.passForm.newPass
      }).then(() => {
        this.$emit('success')
      }).catch(err => {
        this.$message({
          message: err.message || JSON.stringify(err),
          type: 'warning'
        })
      })
    },

    doChangePass() {
      this.$refs.passForm.validate((valid) => {
        if (!valid) {
          return false
        }
      })

      this.postChangePass()
    }
  }
}
</script>
