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

function App(props) {
  const { name, appPrefix } = props

  return (
    <div className={ appPrefix + "-my-app"}>
      <div className={ appPrefix + "-navigator" }><b>{ name }</b></div>
      <div className= { appPrefix + "-left-menu" }>left menu 888</div>
      <div className={ appPrefix + "-main" }>
        {props.children}
      </div>
    </div>
  )
}

export default App


