import cssGlobals from '../../css/variable-app-prefix.scss';

console.info('====', cssGlobals);

const ctxState = {
  appPrefix: cssGlobals.appPrefix,
};
const AppCtx = React.createContext(ctxState);
const { Provider, Consumer } = AppCtx;

export {
  AppCtx as default, Provider, Consumer, cssGlobals,
};
