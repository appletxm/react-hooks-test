<template>
  <div :class="[$store.state.appPrefix + '-c-header']">
    <div class="headr-logo" @click="$router.push({name: 'home.index'})">
      <img src="assets/images/logo.png" width="55"/>
      <img src="assets/images/logo-text.png" height="30"/>
      <!-- <i>后台资料管理系统</i> -->
    </div>

    <div class="header-right">
      <hf-ui-dropdown
        v-if="userInfo.userName"
        class="header-personal"
        @command="handleCommand"
        trigger="click">
        <span class="hf-ui-dropdown-link">
          <img v-if="userInfo.portraitUrl" class="header-portrait" :src="userInfo.portraitUrl" />
          <span v-else class="header-portrait el-icon-s-custom"></span>
          {{ userInfo.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <hf-ui-dropdown-menu slot="dropdown">
          <hf-ui-dropdown-item command="changePass">修改密码</hf-ui-dropdown-item>
          <hf-ui-dropdown-item command="logout">退出</hf-ui-dropdown-item>
        </hf-ui-dropdown-menu>
      </hf-ui-dropdown>
      <div v-else class="header-personal">游客，您好！请<a @click.prevent="$showLoginBox" class="header-login">登录</a></div>
    </div>

    <change-password :showChangePassword="showChagnePass" @close="closeChangePassword" @success="changePassSuccess"></change-password>
  </div>
</template>
<script>
import { getTokenFromCookie } from 'common/auth'
import { userLogout, clearCacheForLogout } from './models'
import ChangePassword from 'components/change-password'

export default {
  name: 'PageHeader',
  components: {
    ChangePassword
  },
  data() {
    return {
      showChagnePass: false
    }
  },
  computed: {
    userInfo() {
      const info = this.$store.state.user.userInfo
      return info
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$showLogOutDialog();
      }

      if (command === 'changePass') {
        this.showChagnePass = true
      }
    },

    $showLogOutDialog() {
      this.$confirm('确定退出登录？', '提示', {
        confirmButtonText: '退出登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$logout();
      }).catch((err) => {
        console.log('$showLogOutDialog err:', err)
      })
    },
    $logout() {
      const token = getTokenFromCookie()
      userLogout({ token: token }).then(() => {
        clearCacheForLogout()
        window.location.href = 'login.html'
      }).catch(err => {
        console.log('$logout err:', err)
      })
    },

    $showLoginBox() {
      this.$store.commit('NEED_SHOW_LOGIN_POP', true)
    },

    closeChangePassword() {
      this.showChagnePass = false
    },

    changePassSuccess() {
      this.showChagnePass = false
      this.$message({
        message: '密码修改成功，请使用新密码重新登录',
        type: 'success'
      })

      setTimeout(() => {
        this.$logout()
      }, 1500)
    }
  },
  created() {
  },
  mounted() {
  }
};
</script>
