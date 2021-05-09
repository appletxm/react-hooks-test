<template src="./template.html"></template>

<script>
import MenuTreeSelect from '../menu-tree-select'
import { DEPARTMENT_STATUES } from 'common/consts'
import { getDevicesDict, getDepartmentsTree, getDepartmentDetail, saveDepartment, checkDepartmentName } from '../../models'
import checkForm from 'mixins/checkform'
import { mapGetters } from 'vuex';

const basicForm = {
  departmentId: '',
  // version: '',
  name: '',
  parentId: '',
  isLocked: '',
  departmentKey: 0,
  description: '',
  equipmentId: []
};

// const $validateDepartmentName = async (rule, value, callback) => {
//   // 如果是编辑模式下的改成和之前的名称
//   if (value === this.sourceDepartmentName && this.departmentId) {
//     return callback();
//   }
//   if (!value) {
//     return callback(new Error('部门名不能为空'));
//   }
//   const isExist = await this.$checkDepartmentName(value);
//   if (isExist) {
//     callback(new Error('部门名称已存在'));
//   } else {
//     callback();
//   }
// };

export default {
  name: 'DepartmentEdit',
  props: {
    departmentId: {
      type: Number,
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
      // selectedMenuParentIds: [],
      isLoading: false,
      departmentStatus: [],
      // sourceDepartmentName: '',
      // $validateDepartmentName,
      tree: [],
      props: {
        label: 'name',
        children: 'children'
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名', trigger: 'blur' },
          // { validator: this.$validateDepartmentName, trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ],
        isLocked: [
          { required: true, message: '请选择部门状态', trigger: 'change' }
        ],
      },

      deviceOptions: [],
    };
  },

  computed: {
    ...mapGetters([
      'isAdmin',
    ]),
    txtSubmit() {
      return this.departmentId ? '提交修改' : '立即创建';
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
    handleCheckChange(data, checked) {
      // debugger
      if (checked) {
        this.basicForm.parentId = data.departmentId;
        this.$refs.tree.setCheckedKeys([data.departmentId]);
      }
    },
    async $checkDepartmentName(name) {
      const params = {
        name: name,
      };
      try {
        const { data } = await checkDepartmentName(params);
        return data;
      } catch (err) {
        this.$message.error(err.message || '部门名查重出错！');
      }
    },

    $getSelectedMenuIds(keys) {
      // console.info('menuParentIds', keys.menuParentIds)
      this.selectedMenuIdList = keys.menuIdList;
      // this.selectedMenuParentIds = keys.menuParentIds;
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

      const resources = []
      this.selectedMenuIdList.forEach((item) => {
        const resource = {
          departmentId: this.basicForm.departmentId,
          resourceId: item
        };
        resources.push(resource)
      });
      // debugger
      const params = {
        // menuParentIds: this.selectedMenuParentIds,
        ...this.basicForm,
        resources: resources,
        equipmentId: JSON.stringify(this.basicForm.equipmentId)
      }

      this.isLoading = true;

      try {
        if (!this.isEditModel) {
          // await updateDepartment(params);
        // } else {
          delete params.departmentId
          // delete params.version
          // await saveDepartment(params);
        }
        await saveDepartment(params);
        this.isLoading = false;

        this.$emit('refresh-data', this.isEditModel !== true)
        // this.$message({
        //   message: `${this.isEditModel ? '更新' : '添加'}部门成功`,
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
        this.$message.error(err.retDesc || '更新部门信息出错');
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
        departmentId: this.departmentId,
      };
      // console.log('departmentId : ', this.departmentId)
      this.isLoading = true;
      try {
        const { data } = await getDepartmentDetail(params);
        // for (const i in data) {
        //   if (this.defaultBasicForm[i] !== undefined) {
        //     this.basicForm[i] = data[i] || '';
        //   }
        // }
        this.basicForm = data
        this.basicForm.equipmentId = JSON.parse(data.equipmentId)
        // this.sourceDepartmentName = data.name;
        // 菜单信息
        this.selectedMenuIdList = [];
        if (data.resources) {
          data.resources.forEach((item) => {
            this.selectedMenuIdList.push(item.resourceId)
          })
        }
        this.sourceSelectedMenuIdList = [...this.selectedMenuIdList];
        this.isLoading = false;
        // console.info('basicForm', this.basicForm)
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取部门详情出错');
      }
    },

    $clearInputField() {
      this.defaultBasicForm = JSON.parse(JSON.stringify(basicForm))
      this.basicForm = JSON.parse(JSON.stringify(basicForm))
      this.$nextTick(function () {
        this.$set(this.basicForm, 'parentId', '0');
      });
      if (this.$refs && this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
        this.$refs.basicForm.resetFields()
      }
      if (this.$refs && this.$refs.menuTreeSelect) {
        this.$refs.menuTreeSelect.$clear()
        this.$refs.basicForm.resetFields()
      }
      this.selectedMenuIdList = [];
    },

    async $init() {
      await this.loadDepartments()
      if (this.isEditModel) {
        await this.$getDetail()
        this.$refs.tree.remove(this.basicForm.departmentId)
        // console.info(this.basicForm.departmentId)
      } else {
        this.$clearInputField()
        this.$set(this.basicForm, 'parentId', '0');
      }
    },

    async loadDepartments() {
      this.isLoading = true
      const res = await getDepartmentsTree()
      this.isLoading = false
      const { data, code } = res
      if (code === 200) {
        this.tree = data
      }
    },

    async loadDevicesDict() {
      this.isLoading = true
      const res = await getDevicesDict()
      this.isLoading = false
      const { data, code } = res
      if (code === 200) {
        data.forEach((item) => {
          const opt = {
            id: item.dictCode,
            label: item.dictValue,
            value: item.dictCode
          }
          this.deviceOptions.push(opt)
        })
      }
    }
  },

  created() {
    Object.values(DEPARTMENT_STATUES).forEach((item, idx) => {
      const status = {
        value: idx,
        label: item
      }
      this.departmentStatus.push(status)
    })
    this.loadDevicesDict()
    // console.info(this.departmentStatus)
    this.$init();
  },
};
</script>
