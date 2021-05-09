<template src="./template.html"></template>

<script>
import MenuTreeSelect from '../menu-tree-select'
import { ROLE_TYPES, ROLE_STATUES } from 'common/consts'
import { getRole, addRole, checkRoleName, updateRole } from '../../models'
import checkForm from 'mixins/checkform'
import { mapGetters } from 'vuex';

const basicForm = {
  id: '',
  version: '',
  roleName: '',
  roleType: '',
  status: '',
  sortNo: 0,
  remark: '',
};
const $validateRoleName = async (rule, value, callback) => {
  // 如果是编辑模式下的改成和之前的名称
  if (value === this.sourceRoleName && this.id) {
    return callback();
  }
  if (!value) {
    return callback(new Error('角色名不能为空'));
  }
  const isExist = await this.$checkRoleName(value);
  if (isExist) {
    callback(new Error('角色名称已存在'));
  } else {
    callback();
  }
};

export default {
  name: 'RoleEdit',
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
  components: {
    MenuTreeSelect,
  },
  data() {
    return {
      defaultBasicForm: { ...basicForm },
      basicForm: { ...basicForm },
      backendErrForm: { ...basicForm },
      sourceSelectedMenuIdList: [],
      selectedMenuIdList: [],
      selectedMenuParentIds: [],
      isLoading: false,
      ROLE_TYPES: ROLE_TYPES,
      ROLE_STATUES: ROLE_STATUES,
      sourceRoleName: '',
      $validateRoleName,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { validator: this.$validateRoleName, trigger: 'blur' }
        ],
        roleType: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ],
      },
    };
  },

  computed: {
    ...mapGetters([
      'isAdmin',
    ]),
    txtSubmit() {
      return this.id ? '提交修改' : '立即创建';
    },
  },

  mixins: [
    checkForm,
  ],

  watch: {
    'toggleCtrl'(val) {
      if (val === true) {
        this.$init()
      }
    }
  },

  methods: {
    async $checkRoleName(roleName) {
      const params = {
        roleName: roleName,
      };
      try {
        const { data } = await checkRoleName(params);
        return data;
      } catch (err) {
        this.$message.error(err.message || '角色名查重出错！');
      }
    },

    $getSelectedMenuIds(keys) {
      this.selectedMenuIdList = keys.menuIdList;
      this.selectedMenuParentIds = keys.menuParentIds;
    },

    $close() {
      this.$emit('close')
    },

    $submit() {
      if (this.isLoading) {
        return;
      }
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.$submitCallBack();
        } else {
          return false;
        }
      });
    },

    async $submitCallBack() {
      this.$refs.menuTreeSelect.$getCheckedKeys();
      const params = {
        menuIdList: this.selectedMenuIdList,
        menuParentIds: this.selectedMenuParentIds,
        ...this.basicForm
      }
      this.isLoading = true;

      try {
        if (this.isEditModel === true) {
          await updateRole(params);
        } else {
          delete params.id
          delete params.version
          await addRole(params);
        }
        this.isLoading = false;
        this.$emit('refresh-data', this.isEditModel !== true)
        // this.$message({
        //   message: `${this.isEditModel ? '更新' : '添加'}角色成功`,
        //   type: 'success',
        //   duration: 1000
        // });
        // setTimeout(() => {
        //   this.$close()
        // }, 0)
        this.$handleSubmitResult()
      } catch (err) {
        if (err.data) {
          this.backendErrForm = Object.assign(this.backendErrForm, this.defaultBasicForm);
          const errArray = err.data || [];
          errArray.forEach((item) => {
            if (this.backendErrForm.hasOwnProperty(item.paramName)) {
              this.$nextTick(() => {
                this.backendErrForm[item.paramName] = item.errorMessage;
              });
            }
          });
        }
        this.isLoading = false;
        this.$message.error(err.retDesc || '更新角色信息出错');
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
        const { data } = await getRole(params);
        for (const i in data) {
          if (this.defaultBasicForm[i] !== undefined) {
            this.basicForm[i] = data[i] || '';
          }
        }
        this.sourceRoleName = data.roleName;
        // 菜单信息
        this.selectedMenuIdList = data.menuRoleList || [];
        this.sourceSelectedMenuIdList = [...this.selectedMenuIdList];
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取角色详情出错');
      }
    },

    $clearInputField() {
      this.defaultBasicForm = JSON.parse(JSON.stringify(basicForm))
      this.basicForm = JSON.parse(JSON.stringify(basicForm))
      this.$nextTick(function () {
        this.$set(this.basicForm, 'roleType', '1');
      });
      if (this.$refs && this.$refs.menuTreeSelect) {
        this.$refs.menuTreeSelect.$clear()
        this.$refs.basicForm.resetFields()
      }
      this.selectedMenuIdList = [];
    },

    $init() {
      if (this.isEditModel) {
        this.$getDetail()
      } else {
        this.$clearInputField()
        this.$set(this.basicForm, 'roleType', '1');
      }
    }
  },

  created() {
    this.$init();
  },
};
</script>
