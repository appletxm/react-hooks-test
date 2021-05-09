<template>
  <hf-ui-dialog
    class="edit-dialog edit-user-pop"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="$handleClose"
    :close-on-click-modal="false"
    append-to-body
    center
    width="800px">
    <hf-ui-form
      labhf-ui-width="100px"
      size="small"
      ref="basicForm"
      v-loading="isLoading"
      :model="basicForm"
      :rules="rules">
      <div class="edit-cell">
        <hf-ui-form-item label="登录账号" prop="account" :error="backendErrForm.account">
          <hf-ui-input v-model="basicForm.account" maxlength="20" placeholder="请输入登录账号"></hf-ui-input>
        </hf-ui-form-item>
        <!-- 新增时才有密码的设置 -->
        <hf-ui-form-item label="密码" prop="password" v-if="!userId" :error="backendErrForm.password">
          <hf-ui-input v-model="basicForm.password" maxlength="20" placeholder="请输入密码"></hf-ui-input>
        </hf-ui-form-item>
        <hf-ui-form-item label="真实姓名" prop="name" :error="backendErrForm.name">
          <hf-ui-input v-model="basicForm.name" maxlength="20" placeholder="请输入真实姓名"></hf-ui-input>
        </hf-ui-form-item>
        <hf-ui-form-item label="手机号码" prop="mobile" :error="backendErrForm.mobile">
          <hf-ui-input v-model="basicForm.mobile" maxlength="32" placeholder="请输入手机号码"></hf-ui-input>
        </hf-ui-form-item>
        <hf-ui-form-item label="电子邮箱" prop="email" :error="backendErrForm.email">
          <hf-ui-input v-model="basicForm.email" maxlength="32" placeholder="请输入电子邮箱"></hf-ui-input>
        </hf-ui-form-item>
      </div>

      <div class="edit-cell department-tree">
        <!-- <hf-ui-form-item label="所属部门" prop="departmentId" :error="backendErrForm.department">
          <hf-ui-tree
            :data="tree"
            :props="props"
            :empty-text="''"
            node-key="departmentId"
            :default-checked-keys="selectedDepartmentIdList"
            :default-expand-all="true"
            :check-strictly="true"
            show-checkbox
            @check-change="handleCheckChange"
            ref="tree">
          </hf-ui-tree>
        </hf-ui-form-item> -->
        <p>所属部门</p>
        <hf-ui-tree
          :data="tree"
          :props="props"
          :empty-text="''"
          node-key="departmentId"
          :default-checked-keys="selectedDepartmentIdList"
          :default-expand-all="true"
          :check-strictly="true"
          show-checkbox
          @check-change="handleCheckChange"
          ref="tree">
        </hf-ui-tree>
      </div>

    </hf-ui-form>

    <div class="g-c">
      <hf-ui-button @click="$handleClose">取 消</hf-ui-button>
      <hf-ui-button type="primary" @click="$submit">确 定</hf-ui-button>
    </div>
  </hf-ui-dialog>
</template>

<script>
import checkForm from 'mixins/checkform'
import { getUser, saveUser } from '../models'
import { getDepartmentsTree } from '../../department/models'

export default {
  name: 'UserEditComponent',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    },
  },
  mixins: [
    checkForm,
  ],
  computed: {
    dialogTitle() {
      return this.userId ? '编辑用户' : '添加用户'
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
    const defaultForm = {
      userId: '',
      account: '',
      name: '',
      mobile: '',
      email: '',
      idCard: '',
      wechat: '',
      password: '',
      department: null
    };
    return {
      isLoading: false,
      defaultBasicForm: { ...defaultForm },
      basicForm: { ...defaultForm },
      backendErrForm: { ...defaultForm },
      tree: [],
      selectedDepartmentIdList: [],
      props: {
        label: 'name',
        children: 'children'
      },
      rules: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    handleCheckChange(data, checked) {
      // debugger
      if (checked) {
        this.selectedDepartmentIdList = [data.departmentId];
        this.$refs.tree.setCheckedKeys([data.departmentId]);
      }
    },
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
      const departments = []
      this.selectedDepartmentIdList.forEach((item) => {
        const department = {
          departmentId: item
        }
        departments.push(department)
      })
      const params = {
        ...this.basicForm,
        departments: departments
      }
      // console.log(params)
      this.isLoading = true;
      try {
        // let data;
        if (this.userId) {
          delete params.password
          // data = await updateUser(params);
        } else {
          delete params.userId
          // data = await addUser(params);
        }
        const data = await saveUser(params);
        this.isLoading = false;
        this.$emit('update-success')
        this.$message({
          message: data.retDesc,
          type: 'success',
          duration: 1000
        });
      } catch (err) {
        this.isLoading = false;
        if (err.retCode === '300001' && err.data) {
          this.backendErrForm = Object.assign(this.backendErrForm, this.defaultBasicForm);
          const errArray = err.data || [];
          errArray.forEach((item) => {
            if (this.backendErrForm.hasOwnProperty(item.paramName)) {
              // 解决 element form表单组件重复错误提示不显示
              this.$nextTick(() => {
                this.backendErrForm[item.paramName] = item.errorMessage;
              });
            }
          });
        } else {
          this.$message.error(err.retDesc || '更新用户信息出错');
        }
      }
    },
    async $getDetail() {
      const params = {
        userId: this.userId,
      };
      this.isLoading = true;
      try {
        const { data, code } = await getUser(params);
        if (code === 200) {
          // Object.keys(this.basicForm).forEach(key => {
          //   this.basicForm[key] = res.data[key]
          // })
          this.basicForm = data
          this.selectedDepartmentIdList = []
          if (data.departments) {
            data.departments.forEach((item) => {
              this.selectedDepartmentIdList.push(item.departmentId)
              console.info('item.DepartmentId...', item.departmentId)
            })
            console.info('selectedDep...', this.selectedDepartmentIdList)
          }
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message || '获取用户详情出错');
      }
    },
    async loadDepartments() {
      this.isLoading = true
      const res = await getDepartmentsTree()
      this.isLoading = false
      const { data, code } = res
      if (code === 200) {
        this.tree = data
        // console.info(this.tree)
      }
    },
    async $init() {
      if (this.userId) {
        this.$getDetail()
      }
      this.loadDepartments()
    }
  }
};
</script>
