<template>
  <hf-ui-layout type="sidebar" :class="[$store.state.appPrefix + '-my-app']" v-loading="isInitiApp">
    <hf-ui-header>
      <page-header></page-header>
    </hf-ui-header>
    <hf-ui-layout class="app-body">
      <hf-ui-aside :width="200">
        <left-menu class="menu-theme-overrid" />
      </hf-ui-aside>
      <div class="aside-right" :class="{'left-menu-collapse': $store.state.leftMenu.isLeftbarCollapse}">
        <hf-ui-layout>
          <page-bread-crumb class="hf-ui-breadcrumb" />
          <hf-ui-main :class="[$store.state.appPrefix + '-module-all']">
            <router-view />
          </hf-ui-main>
        </hf-ui-layout>
      </div>
    </hf-ui-layout>
    <login-box
      v-show="$store.state.needShowLoginPop"
    >
    </login-box>
  </hf-ui-layout>
</template>

<script>
import LoginBox from 'components/login-pop'
import PageHeader from 'components/header'
import LeftMenu from 'components/left-menu'
import PageBreadCrumb from 'components/bread-crumb'
import { getUserInfoFromCache } from './models'
import { USER_INFO } from 'store/mutation-types'
import { checkUserLogin } from 'common/auth'

export default {
  components: {
    LoginBox,
    PageHeader,
    LeftMenu,
    PageBreadCrumb
  },
  data() {
    return {
      isInitiApp: false
    }
  },
  watch: {},
  methods: {
    $initApp() {
      const userInfo = getUserInfoFromCache()
      this.$store.commit(USER_INFO, userInfo)
    },

    resizeApp() {
      const body = document.querySelector('.app-body')
      const height = document.documentElement.clientHeight
      body.style.height = (height - 60) + 'px'
    }
  },
  created() {
    if (checkUserLogin() !== true) {
      this.$store.state.needShowLoginPop = true
    } else {
      this.$initApp()
    }
  },
  mounted() {
    this.resizeApp()

    window.addEventListener('resize', () => {
      this.resizeApp()
    })
  }
}
</script>
