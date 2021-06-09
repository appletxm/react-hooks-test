module.exports = {
  'globals': {
    'moment': true,
    '_': true,
    'React': true,
    'ReactDom': true
  },
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'parser': 'babel-eslint',
  // 'parserOptions': {
  //   'ecmaFeatures': {
  //     'experimentalObjectRestSpread': true,
  //     'jsx': true
  //   },
  //   'sourceType': 'module'
  // },
  'extends': [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  'plugins': [
    'import',
    'react',
    'jsx-a11y'
  ],
  'rules': {
    'no-param-reassign': 0,
    'no-multi-assign': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0
    // 'linebreak-style': 'off',
    // 'no-restricted-syntax': 0,
    // 'no-else-return': 0,
    // 'guard-for-in': 0,
    // 'no-prototype-builtins': 0,
    // 'dot-notation': 0,
    // 'no-alert': 0,
    // 'object-shorthand': 0,
    // 'no-lonely-if': 0,
    // 'semi': 0,
    // 'comma-dangle': 0,
    // 'import/no-unresolved': 0,
    // 'padded-blocks': 0,
    // 'import/prefer-default-export': 0,
    // 'prefer-template': 0,
    // 'object-curly-newline': 0,
    // 'consistent-return': 0,
    // 'operator-assignment': 0,
    // 'func-names': 0,
    // 'no-plusplus': 0,
    // 'no-unused-expressions': 0,
    // 'max-len': 0,
    // 'no-shadow': 0,
    // 'prefer-destructuring': 0,
    // 'prefer-spread': 0,
    // 'no-useless-escape': 0,
    // 'no-underscore-dangle': 0,
    // 'no-mixed-operators': 0,
    // 'no-bitwise': ['error', { 'allow': ['~', '|'] }],
    'import/extensions': 0,
    // 'class-methods-use-this': 0,
    // 'no-continue': 0,
    // 'no-nested-ternary': 0,
    // 'import/extensions': 0,
    // 'no-continue': 0,
    // 'no-nested-ternary': 0,
    // 'import/extensions': 0,
    // 'class-methods-use-this': 0,
    // 'no-case-declarations': 0,
    // 'arrow-body-style': 0,
    // 'prefer-object-spread': 0,
    // 'prefer-rest-params': 0,
    // 'import/no-named-as-default': 0,
    // 'global-require': 0
  }
};
