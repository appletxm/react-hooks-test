import { appPrefix, PageContainer } from 'components/page-container'
import App from './app/index.jsx';
import getRoutes from './router/index.jsx';

PageContainer(
  <App name={'txm'} appPrefix={appPrefix}>
    { getRoutes() }
  </App>
)
