import '../../../css/index.scss';
// import '../../primitive-components/x-search';
import ErrorBoundary from 'components/error-boundary';
import { Provider, cssGlobals } from '../../providers/app-ctx';

import TestDecorator from '../../test/decorator';

const ctxValue = { appPrefix: cssGlobals.appPrefix, name: 9999 };
const { render } = ReactDOM;

const ins = new TestDecorator(666);
console.log('**decorate5**', ins.txm, ins.testLog());

export const { appPrefix } = cssGlobals;

export const PageContainer = function (node) {
  render((
    <ErrorBoundary>
      <Provider value={ctxValue}>
        { node }
      </Provider>
    </ErrorBoundary>
  ), document.querySelector('#app'));
};
