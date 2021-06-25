const eslintCfg = {
  'globals': {
    'moment': true,
    '_': true,
    'React': true,
    'ReactDOM': true,
    'ReactRouterDOM': true,
    'PropTypes': true
  },
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'parser': 'babel-eslint',
  'extends': [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended'
  ],
  'plugins': [
    'import',
    'react',
    'jsx-a11y',
    'react-hooks'
  ],
  'rules': {
    'no-param-reassign': 0,
    'no-multi-assign': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'class-methods-use-this': 1,
    'func-names': 0
  }
};

module.exports = eslintCfg
