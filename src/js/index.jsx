import '../css/index.scss';
import './primitive-components/x-search';
import ErrorBoundary from 'components/error-boundary';
import App from './app/index.jsx';
import getRoutes from './router/index.jsx';
import { Provider, cssGlobals } from './providers/app-ctx';

import TestDecorator from './test/decorator';

const ctxValue = { appPrefix: cssGlobals.appPrefix, name: 9999 };
const { render } = ReactDOM;

const ins = new TestDecorator(666);
console.log('**decorate5**', ins.txm, ins.testLog());

render((
  <ErrorBoundary>
    <Provider value={ctxValue}>
      <App name={'txm'} appPrefix={cssGlobals.appPrefix}>
        { getRoutes() }
      </App>
    </Provider>
  </ErrorBoundary>
), document.querySelector('#app'));
