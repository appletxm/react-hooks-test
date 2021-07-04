import '../css/index.scss';
import './primitive-components/x-search';
import ErrorBoundary from 'components/error-boundary';
import App from './app/index.jsx';
import getRoutes from './router/index.jsx';
import { Provider, cssGlobals } from './providers/app-ctx';

import testDecorator from './test/decorator'

const ctxValue = { appPrefix: cssGlobals.appPrefix, name: 9999 };

const ins = new testDecorator(666);
console.log('**decorate5**', ins.txm, ins.testLog())

ReactDOM.render((
  <ErrorBoundary>
    <Provider value={ctxValue}>
      <App name={'txm'} appPrefix={cssGlobals.appPrefix}>
        { getRoutes() }
      </App>
    </Provider>
  </ErrorBoundary>
), document.querySelector('body'));
