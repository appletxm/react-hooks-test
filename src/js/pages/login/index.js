/* global Vue */
import html from './template.html'
import styles from '../../../css/index.scss'
import { decorate } from 'common/axios-decorate'
import Login from 'components/login'
import { setInitialStates } from 'store/state'
import { getStore } from 'store'

const envCfg = require('env.cfg')

const { appPrefix } = styles
const state = setInitialStates({ appPrefix })
const store = getStore(state)

const LoginPage = {
  template: html,
  components: {
    Login,
  },
  data() {
    return {
      logoSrc: envCfg.publicPath + 'assets/images/logo.png',
      logoTextSrc: envCfg.publicPath + 'assets/images/logo-text.png'
    }
  },
};

function bootStrap() {
  decorate()

  new Vue({
    store,
    render: (h) => {
      global.store = store
      return h(LoginPage)
    }
  }).$mount('#app')
}
bootStrap()
