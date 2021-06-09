/* globals ReactDOM */
import '../css/index.scss'
import App from './app'
import getRoutes from './router'

import cssGlobals from '../css/variable-app-prefix.scss'

// console.info('====', cssGlobals)

ReactDOM.render((
<App name={'txm'} appPrefix={cssGlobals.appPrefix}>
  { getRoutes() }
</App>
), document.querySelector('body'));
