import AppCtx from '../providers/app-ctx';

const { Link, BrowserRouter } = ReactRouterDOM;

window.wx = {
  a: 1,
  b: 2
}

const App = class App extends React.Component {
  static contextType = AppCtx

  // constructor(props) {
  //   super(props);
  // }

  componentDidUpdate() {
    console.info('**did update***', this.context);
  }

  componentDidMount() {
    console.info('***did mount**', this.context);
  }

  render() {
    const { appPrefix, name, children } = this.props;
    console.info('***render**', this.context);

    return (
      <div className={ `${appPrefix}-my-app`}>
        <BrowserRouter>
          <div className={ `${appPrefix}-navigator` }><b>{ name }</b></div>
          <div className= { `${appPrefix}-left-menu` }>
              <ul>
                <li><Link to="/home">home page</Link></li>
                <li><Link to="/about">about page</Link></li>
              </ul>
          </div>
          <div className={ `${appPrefix}-main` }>
            {children}
          </div>
        </BrowserRouter>
      </div>
    );
  }
};

App.propTypes = {
  appPrefix: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default App;
