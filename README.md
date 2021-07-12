# react-hooks-test

Try to learn react-hooks

## update webpack-hot-middleware

For resolving the hot update issue in webpack5 you need to add below statement to your `webpack-hot-middleware`, file path is `node_modules/webpack-hot-middleware/process-update.js`

```javascript

if (!module.hot) {
  throw new Error('[HMR] Hot Module Replacement is disabled.');
} else {
  module['hot'].accept();
}

```

## technical stack
react(17) + mobx(6)
