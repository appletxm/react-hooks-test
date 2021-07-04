const queue = {};

export const eventBus = {
  on(id, cb) {
    if (!queue[id]) {
      queue[id] = [];
    }
    queue[id].push(cb);
  },

  emit(id, ...params) {
    const cbs = queue[id];
    if (cbs) {
      cbs.forEach((cb) => {
        cb.call(null, [...params]);
      });
    }
  },

  off(id, cb) {
    const cbs = queue[id];
    queue[id] = cbs.filter((qCb) => qCb === cb);
  },
};

export default eventBus;
