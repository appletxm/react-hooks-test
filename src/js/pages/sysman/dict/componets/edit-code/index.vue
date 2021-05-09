<template src="./template.html"></template>

<script>
import { getCode, addCode, updateCode } from '../../models'
import checkForm from 'mixins/checkform'

const basicForm = {
  codeNum: '',
  codeName: '',
  sortNo: '',
  remark: '',
};

export default {
  name: 'CodeEdit',
  props: {
    id: {
      type: String,
      default: ''
    },
    codeTypeId: {
      type: String,
      default: ''
    },
    codeTypeNum: {
      type: String,
      default: ''
    },
    isEditModel: {
      type: Boolean,
      default: false
    },
    toggleCtrl: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formName: 'basicForm',
      defaultBasicForm: { ...basicForm },
      basicForm: { ...basicForm },
      version: '',
      isSubmiting: false,
      isLoading: false,
      isBasicFormCollpase: false,
      codeTypeNum: '',
      rules: {
        codeNum: [
          { required: true, message: '请输入字典数据编号', trigger: 'blur' },
        ],
        codeName: [
          { required: true, message: '请输入字典数据名称', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    title() {
      return this.isEditModel ? '编辑字典数据' : '新增字典数据';
    },
    txtSubmit() {
      return this.isEditModel ? '提交修改' : '立即创建';
    },
  },
  watch: {
    'toggleCtrl'(val) {
      if (val === true) {
        this.$init()
      }
    }
  },
  mixins: [
    checkForm
  ],
  methods: {
    $toggleContentCollpase(isCollpase, labelName) {
      this[labelName] = isCollpase;
    },

    $close() {
      this.$emit('close')
    },

    async $submit() {
      if (this.isSubmiting) {
        return;
      }
      if (!this.$checkForm(this.formName)) {
        return;
      }

      const params = { id: this.id, codeTypeNum: this.codeTypeNum, ...this.basicForm }
      this.isSubmiting = true;
      try {
        if (this.isEditModel) {
          params.version = this.version;
          await updateCode(params);
        } else {
          await addCode(params);
        }

        this.isSubmiting = false;
        this.$emit('refresh-data')

        if (this.isEditModel === true) {
          this.$message.success('操作成功!');
          setTimeout(() => {
            this.$close()
          }, 100)
        } else {
          this.$confirm('操作成功！', '提示', {
            confirmButtonText: '关闭弹窗',
            cancelButtonText: '再建一个',
            type: 'success',
          }).then(() => {
            this.$close();
          }).catch(() => {
            this.$resetForm();
          })
        }
      } catch (err) {
        this.isSubmiting = false;
        this.$message.error(err.message || '更新字典信息出错！');
      }
    },
    $resetForm() {
      this.$refs.basicForm.resetFields()
      if (this.isEditModel !== true) {
        this.$clearInputField()
      } else {
        this.$init();
      }
    },
    async $getDetail() {
      const params = {
        id: this.id,
      };
      this.isLoading = true;
      try {
        const { data } = await getCode(params);
        for (const i in data) {
          if (this.defaultBasicForm[i] !== undefined) {
            this.basicForm[i] = data[i];
          }
        }

        this.version = data.version;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取字典详情出错！');
      }
    },

    $clearInputField() {
      this.defaultBasicForm = JSON.parse(JSON.stringify(basicForm))
      this.basicForm = JSON.parse(JSON.stringify(basicForm))
    },

    $init() {
      if (this.isEditModel === true) {
        this.$getDetail()
      } else {
        this.$clearInputField()
      }
    }
  },
  created() {
    this.$init()
  },
  mounted() {}
};
</script>
