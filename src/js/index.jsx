import '../css/index.scss';
import './primitive-components/x-search';
import ErrorBoundary from 'components/error-boundary';
import App from './app/index.jsx';
import getRoutes from './router/index.jsx';
import { Provider, cssGlobals } from './providers/app-ctx';

const ctxValue = { appPrefix: cssGlobals.appPrefix, name: 9999 };

// function testable(...arg) {
//   console.info('****', arg);
// }
// @testable(true)
// class test {
//   constructor(...arg) {
//     console.info('=====', arg);
//   }
// }

// test(666);

ReactDOM.render((
  <ErrorBoundary>
    <Provider value={ctxValue}>
      <App name={'txm'} appPrefix={cssGlobals.appPrefix}>
        { getRoutes() }
      </App>
    </Provider>
  </ErrorBoundary>
), document.querySelector('body'));
