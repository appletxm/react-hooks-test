<template>
  <div :class="[{'collapse': isLeftbarCollapse}, $store.state.appPrefix + '-c-left-menu']">
    <hf-ui-menubar mode="vertical" :collapse="isLeftbarCollapse" @toggleCollapse="handleCollapse">
      <hf-ui-menu :default-active="curPath" :collapse="isLeftbarCollapse">
        <template v-for="menu in menuList">
          <template v-if="menu.children.length > 0">
            <hf-ui-submenu :key="menu.id" :index="menu.menuUrl" class="is-first-level">
              <template slot="title">
                <i :class="[menu.menuIcon ? (menu.menuIcon) : '']"></i>
                <span>{{ menu.menuName }}</span>
              </template>

              <template v-for="submenu in menu.children">
                <hf-ui-submenu v-if="submenu.children.length > 0" :key="submenu.id" :index="submenu.menuUrl">
                  <span slot="title">{{ submenu.menuName }}</span>
                  <hf-ui-menu-item v-for="thirdMenu in submenu.children" :key="thirdMenu.id" :index="thirdMenu.menuUrl" @click="handleLeftbarSelect(thirdMenu)">
                    <span slot="title">
                      <i :class="[thirdMenu.menuIcon ? (thirdMenu.menuIcon) : '']"></i>{{ thirdMenu.menuName }}
                    </span>
                  </hf-ui-menu-item>
                </hf-ui-submenu>
                <hf-ui-menu-item v-else :key="submenu.id" :index="submenu.menuUrl" @click="handleLeftbarSelect(submenu)">
                  <i :class="[submenu.menuIcon ? (submenu.menuIcon) : '']"></i>
                  <span slot="title">
                    {{ submenu.menuName }}
                  </span>
                </hf-ui-menu-item>
              </template>
            </hf-ui-submenu>
          </template>

          <hf-ui-menu-item v-else :key="menu.id" :index="menu.menuUrl" class="is-first-level" @click="handleLeftbarSelect(menu)">
            <i :class="[menu.menuIcon ? (menu.menuIcon) : '']"></i>
            <span slot="title">
              {{ menu.menuName }}
            </span>
          </hf-ui-menu-item>
        </template>
      </hf-ui-menu>
    </hf-ui-menubar>
  </div>
</template>

<script>
/* 菜单数据格式
  children: []
  id: "1045970495056490497"
  menuIcon: "el-icon-setting"
  menuName: "系统管理"
  menuUrl: "/sysman"
  parentId: "0"
  parentIds: "0"
  sortNo: 5
*/
export default {
  data() {
    return {
      curPath: '',
      isLoading: false,
    };
  },
  computed: {
    'isLeftbarCollapse'() {
      return this.$store.state.leftMenu.isLeftbarCollapse
    },
    'menuList'() {
      // console.log(this.$store.state.leftMenu.menuList)
      return this.$store.state.leftMenu.menuList
    },

    collapseTxt() {
      return this.isLeftbarCollapse ? '展开' : '收起';
    },
  },
  watch: {
    '$route'(route) {
      // this.curPath = route.path;
      this.curPath = route.meta.menuPath
      // console.log('curPath:', route.meta.menuPath)
    },
  },
  methods: {
    handleCollapse() {
      this.$store.commit('LEFTBAR_CHANGE', this.isLeftbarCollapse);
    },

    handleLeftbarSelect(item) {
      this.$router.push({
        path: item.menuUrl
      })
    }
  },
  created() {
  }
};
</script>
