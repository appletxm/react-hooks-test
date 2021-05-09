<template src="./template.html"></template>

<script>
import checkForm from 'mixins/checkform'
import { DEFAULT_ERROR_MSG } from 'common/consts'
import { setItem, getItem, removeItem } from 'common/storage'
import { USER_INFO, MENU_LIST, RAW_MENU_LIST } from 'store/mutation-types'
import { userLogin, setUserInfoToCache } from './models'
import { setMenuInfoToCache, decorateMenuList } from 'components/left-menu/models'
import messager from 'common/messager'

export default {
  name: 'Login',
  mixins: [
    checkForm,
  ],
  props: {
    isPoplogin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSubmiting: false,
      formName: 'loginForm',
      checked: true,
      loginForm: {
        account: '',
        password: '',
      },
      checkCodeImgSrc: '',
      loginRules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
    };
  },
  watch: {
    isPoplogin() {
      this.loginForm.account = getItem('userName_remember')
    }
  },
  mounted() {
    this.loginForm.account = getItem('userName_remember')
  },
  methods: {
    async $login() {
      const params = this.loginForm

      if (!this.$checkForm(this.formName)) {
        return false
      }
      if (this.checked) {
        setItem('userName_remember', this.loginForm.account)
      } else {
        removeItem('userName_remember')
      }

      try {
        this.isSubmiting = true
        const userInfo = await userLogin(params)
        this.isSubmiting = false

        setUserInfoToCache(userInfo)
        setMenuInfoToCache(userInfo)

        if (this.isPoplogin === true) {
          this.$store.commit(USER_INFO, userInfo)
          this.$store.commit(RAW_MENU_LIST, userInfo.data.resources)
          this.$store.commit(MENU_LIST, decorateMenuList(userInfo.data.resources || []), [])
          // this.$emit('login-success', true)
          window.location.reload()
        } else {
          window.location.href = 'index.html'
        }
      } catch (err) {
        console.log('$login err: ', err)
        this.isSubmiting = false
        messager.showMsg('warning', err.message ? err.message : DEFAULT_ERROR_MSG)
      }
    },
    resetLoginForm() {
      this.$refs[this.formName].resetFields();
    },
  },
};
</script>
