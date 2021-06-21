/* eslint-disable no-global-assign */
const currentEvents = {};

function pathIsMatched(path, triggerUrl) {
  if (typeof triggerUrl === 'string') {
    return path === triggerUrl;
  }

  if (triggerUrl.constructor.name.toLocaleLowerCase() === 'array') {
    return (triggerUrl).indexOf(path) >= 0;
  }

  return '';
}

export default {
  pushEvent(options) {
    const {
      key, event, params, context, needKeep, triggerUrl,
    } = options;
    currentEvents[key] = {
      event, params, context, needKeep, triggerUrl,
    };
  },

  deleteEvent(key) {
    delete currentEvents[key];
  },

  clearQueue() {
    const keys = Object.keys(currentEvents);
    keys.forEach((key) => {
      const { needKeep } = currentEvents[key];
      if (!needKeep || needKeep !== true) {
        delete currentEvents[key];
      }
    });
  },

  getQueue() {
    return currentEvents;
  },

  generateEventId() {
    const id = `event-${Math.floor(Math.random() * 1000000)}`;
    return id;
  },

  executeQueue(route) {
    const events = this.getQueue();
    const keys = Object.keys(events);

    if (keys.length === 0) {
      return false;
    }

    keys.forEach((key) => {
      const args = events[key].params || {};
      const fn = events[key].event || [];
      const { context, triggerUrl } = events[key];

      if (fn && typeof fn === 'function') {
        if (triggerUrl && !pathIsMatched(route.path, triggerUrl)) {
          return;
        }
        if (context) {
          fn.apply(context, args);
        } else {
          fn(args);
        }
      }
    });

    return true;
  },
};
/* eslint-enable no-global-assign */
