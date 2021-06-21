// // /* globals React */

// import Comment from 'components/comment'
// import Clock from 'components/clock'
// import Toggle from 'components/toggle'
// // import NameForm from 'components/name-form'
// // import axios from 'axios'

// const { Suspense, lazy } = React
// const NameForm = lazy(() => import(/* webpackChunkName: "compNameForm" */'components/name-form'))

// function App(props) {
//   const numbers = [1, 2, 3, 4, 5];
//   const listItems = numbers.map((number, index) =>
//     <li key={index}>{number}</li>
//   );

//   // const res = axios.get('https://ssor.stgairasia.com/config/v2/clients/by-origin', {
//   //   headers: {
//   //     'Access-Control-Allow-Credentials': true,
//   //     'content-type': 'application/json',
//   //     'origin': 'https://servicewechat.com'
//   //   }
//   // })

//   // const res = axios.get('/api/token', {
//   //     headers: {
//   //     'Access-Control-Allow-Credentials': true,
//   //     'content-type': 'application/json',
//   //     'origin': 'https://servicewechat.com'
//   //   }
//   // })

//   // res.then(result => {
//   //   console.info(result)
//   // }).catch(err => {
//   //   console.info(err)
//   // })

//   return (
//     <div>
//       999999999 {props.name}
//       <Comment name={'yoyo'}></Comment>
//       <Clock></Clock>
//       <Toggle></Toggle>
//       <ul>
//         {listItems}
//       </ul>
//       <Suspense fallback={<div>.....</div>}>
//         <NameForm></NameForm>
//       </Suspense>
//     </div>
//   );
// }

// export default App;

// function App(props) {
//   const { name, appPrefix } = props

//   console.info(props)

//   return (
//     <div className={ appPrefix + "-my-app"}>
//       <BrowserRouter>
//         <div className={ appPrefix + "-navigator" }><b>{ name }</b></div>
//         <div className= { appPrefix + "-left-menu" }>
//             <ul>
//               <li><Link to="/home">home page</Link></li>
//               <li><Link to="/about">about page</Link></li>
//             </ul>
//         </div>
//         <div className={ appPrefix + "-main" }>
//           {props.children}
//         </div>
//       </BrowserRouter>
//     </div>
//   )
// }

import AppCtx from '../providers/app-ctx';

const { Link, BrowserRouter } = ReactRouterDOM;

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
