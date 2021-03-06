/* global Vue */
import { removeAllCookie } from 'common/auth';
import { removeItemAll } from 'common/storage';
import globals from 'common/globals';
import { NEED_SHOW_LOGIN_POP } from 'store/mutation-types';

export const handleTokenExpired = function handleTokenExpired() {
  if (globals.store.state.isHandingExpired !== true) {
    removeItemAll();
    removeAllCookie();
    globals.store.commit(NEED_SHOW_LOGIN_POP, true);
  }
};

export const errorPopMsg = {
  showTimeoutErrConfrim(errorObj) {
    Vue.prototype.$alert('请重新登录', '登录过期').then(() => {
      const url = `${window.location.origin}${window.location.pathname} #/login?timeOut=1`;
      removeAllCookie();
      window.location.href = url;
    }).catch(() => {
      if (errorObj) {
        throw (errorObj);
      }
    });
  },
};

export const errorCodeMatch = {
  '-1': function (resData) {
    const mesg = (resData.detailMessage || resData.message) || resData.msg;
    const errorObj = { code: resData.code, message: mesg };
    // errorPopMsg.showTimeoutErrConfrim(errorObj)
    throw (errorObj);
  },

  100014(resData) {
    const errorObj = { code: resData.retCode, message: resData.retDesc };
    handleTokenExpired(resData);
    throw (errorObj);
  },

  401(resData) {
    const errorObj = { code: resData.retCode, message: resData.retDesc };
    handleTokenExpired(resData);
    throw (errorObj);
  },
};
