<template src="./template.html"></template>
<script>
import MenuTreeSearch from '../menu-tree-search'
import { getMenu, addMenu, updateMenu } from '../../models'
import checkForm from 'mixins/checkform'
import { MENU_WEIGHT, MENU_TYPE, MENU_BE_LONG_TYPE, MENU_STATE } from 'common/consts'

const basicForm = {
  parentId: '',
  menuName: '',
  menuType: '',
  menuUrl: '',
  isShow: '',
  belongType: '',
  weight: '',
  sortNo: '',
  menuIcon: '',
  permission: '',
};
const detailForm = {
  remark: '',
};

export default {
  name: 'MenuEdit',
  props: {
    parentId: {
      type: String,
      default: ''
    },
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
  components: {
    MenuTreeSearch
  },
  data() {
    return {
      formName: 'basicForm',
      defaultBasicForm: { ...basicForm },
      basicForm: { ...basicForm },
      defaultDetailForm: { ...detailForm },
      detailForm: { ...detailForm },
      version: '',
      isSubmiting: false,
      isLoading: false,
      isBasicFormCollpase: false,
      menuTypeMap: MENU_TYPE,
      menuBelongTypeMap: MENU_BE_LONG_TYPE,
      menuIsShowMap: MENU_STATE,
      menuWeightMap: MENU_WEIGHT,
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '请选择菜单类型', trigger: 'change' },
        ],
        isShow: [
          { required: true, message: '请选择菜单是否显示', trigger: 'change' },
        ],
        menuUrl: [
          { required: true, message: '请输入菜单链接', trigger: 'blur' },
        ]
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
      return this.isEditModel ? '编辑菜单' : '新增菜单';
    },
    txtSubmit() {
      return this.isEditModel ? '提交修改' : '立即创建';
    },
  },
  mixins: [
    checkForm
  ],
  methods: {
    toggleContentCollpase(isCollpase, labelName) {
      this[labelName] = isCollpase;
    },

    clearSelMenuData() {
      this.basicForm.parentId = '';
    },

    getSelMenuData(selectedOrgNode) {
      if (selectedOrgNode) {
        this.basicForm.parentId = selectedOrgNode.id;
      } else {
        this.basicForm.parentId = '';
      }
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

      const params = { id: this.id, ...this.basicForm, ...this.detailForm }
      this.isSubmiting = true;

      try {
        let data;
        if (this.isEditModel) {
          params.version = this.version;
          data = await updateMenu(params);
        } else {
          data = await addMenu(params);
        }
        this.isSubmiting = false;
        this.$emit('refresh-data')
        this.$handleSubmitResult(data)
      } catch (err) {
        this.isSubmiting = false;
        this.$message.error(err.message || '更新菜单信息出错！');
      }
    },

    $handleSubmitResult() {
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
    },

    $resetForm() {
      if (this.$refs && this.$refs.basicForm) {
        this.$refs.basicForm.resetFields()
      }
      if (this.$refs && this.$refs.menuTreeSearch) {
        this.$refs.menuTreeSearch.reload()
      }
      if (!this.isEditModel) {
        Object.assign(this.basicForm, this.defaultBasicForm);
        Object.assign(this.detailForm, this.defaultDetailForm);
        return false;
      }

      this.$init();
    },

    async $getDetail() {
      const params = {
        id: this.id,
      };
      this.isLoading = true;
      try {
        const { data } = await getMenu(params);

        for (const i in data) {
          if (this.defaultBasicForm[i] !== undefined) {
            this.basicForm[i] = data[i];
          }
          if (this.defaultDetailForm[i] !== undefined) {
            this.detailForm[i] = data[i];
          }
        }

        this.version = data.version;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取菜单详情出错！');
      }
    },

    $init() {
      // console.info(`this.parentId=${this.parentId}, this.id=${this.id}`)
      if (this.id) {
        this.$getDetail()
      }

      if (this.isEditModel !== true) {
        this.$resetForm()
      }

      this.basicForm.parentId = this.parentId
    }
  },

  created() {
    this.$init()
  }
}
</script>
