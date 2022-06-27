const { makeAutoObservable } = mobx;

class User {
  userInfo = {}

  permission = {}

  accessToken = ''

  constructor() {
    makeAutoObservable(this, {});
  }

  set setUserInfo(info) {
    this.userInfo = info;
  }

  set setToken(token) {
    this.accessToken = token;
  }

  set setPermission(permission) {
    this.permission = permission;
  }

  * doLogin() {
    const response = yield fetch('/api/value');
    this.value = response.json();
  }
}

export default User;
