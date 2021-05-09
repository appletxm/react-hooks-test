import { PERMISSION_CONTROL } from 'common/consts'

export default {
  methods: {
    $hasPermission(permissionKey) {
      if (!PERMISSION_CONTROL) {
        return true;
      }
      // const currentPagePermission = this.$store.state.leftMenu.currentMenuItem.permission
      const { permissionList } = this.$store.state.user
      // permissionKey = currentPagePermission + '--' + permissionKey
      return permissionList.some(item => permissionKey === item)
    }
  }
};
