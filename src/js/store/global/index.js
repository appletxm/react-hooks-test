const {
  makeObservable, observable, computed, action, flow,
} = mobx;

class Doubler {
    value

    constructor(value) {
      makeObservable(this, {
        value: observable,
        double: computed,
        increment: action,
        fetch: flow,
      });
      this.value = value;
    }

    get double() {
      return this.value * 2;
    }

    increment() {
      this.value += 1;
    }

    * fetch() {
      const response = yield fetch('/api/value');
      this.value = response.json();
    }
}

export default Doubler;
