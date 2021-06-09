const { lazy, Suspense } = React
const { BrowserRouter, Route, Switch } = ReactRouterDOM

const Home = lazy(() => import(/* webpackChunkName: "pageHome" */'pages/home'))
const About = lazy(() => import(/* webpackChunkName: "pageAbout" */'pages/about'))

const getRoutes = function () {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default getRoutes
