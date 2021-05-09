<template src="./template.html"></template>

<script>
import { getDict, addDict, updateDict } from '../../models'
import checkForm from 'mixins/checkform'

const basicForm = {
  codeTypeNum: '',
  codeTypeName: '',
  nationNum: '',
  remark: '',
};

export default {
  name: 'DictEdit',
  props: {
    id: {
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
  components: {},
  data() {
    return {
      id: '',
      isEditModel: false,
      formName: 'basicForm',
      defaultBasicForm: { ...basicForm },
      basicForm: { ...basicForm },
      version: '',
      isSubmiting: false,
      isLoading: false,
      isBasicFormCollpase: false,
      rules: {
        codeTypeNum: [
          { required: true, message: '请输入代码类型代码', trigger: 'blur' },
        ],
        codeTypeName: [
          { required: true, message: '请输入代码类型名称', trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    'toggleCtrl'(val) {
      if (val === true) {
        this.$init()
      }
    }
  },
  computed: {
    title() {
      return this.isEditModel ? '编辑字典类型' : '新增字典类型';
    },
    txtSubmit() {
      return this.isEditModel ? '提交修改' : '立即创建';
    },
  },
  mixins: [
    checkForm
  ],
  methods: {
    clearSelDictData() {
      this.basicForm.parentId = '';
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

      const params = { id: this.id, ...this.basicForm };
      this.isSubmiting = true;

      try {
        if (this.isEditModel) {
          params.version = this.version;
          await updateDict(params);
        } else {
          await addDict(params);
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
        const { data } = await getDict(params);
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
    this.$init();
  }
};
</script>
