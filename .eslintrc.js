const eslintCfg = {
  'globals': {
    'moment': true,
    '_': true,
    'React': true,
    'ReactDOM': true,
    'ReactRouterDOM': true,
    'PropTypes': true,
    'mobx': true,
    'mobxReactLite': true,
    'antd': true
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
  
  'settings': {
    'react': {
      'createClass': 'createReactClass', // Regex for Component Factory to use,
      // default to 'createReactClass'
      'pragma': 'React', // Pragma to use, default to 'React'
      'fragment': 'Fragment', // Fragment to use (may be a property of <pragma>), default to 'Fragment'
      'version': 'detect', // React version. 'detect' automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to 'detect' in the future
      'flowVersion': '999.999.999' // Flow version
    },
    'propWrapperFunctions': [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      {
        'property': 'freeze',
        'object': 'Object'
      },
      {
        'property': 'myFavoriteWrapper'
      }
    ],
    'componentWrapperFunctions': [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      {
        'property': 'styled'
      }, // `object` is optional
      {
        'property': 'observer',
        'object': 'Mobx'
      },
      {
        'property': 'observer',
        'object': '<pragma>'
      } // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    'linkComponents': [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {
        'name': 'Link',
        'linkAttribute': 'to'
      }
    ]
  },

  'rules': {
    'no-param-reassign': 0,
    'no-multi-assign': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'class-methods-use-this': 1,
    'func-names': 0,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'max-len': 0,
    'react/prop-types': 0
  }
};

module.exports = eslintCfg
