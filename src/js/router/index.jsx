const { lazy, Suspense } = React;
const { Route, Switch } = ReactRouterDOM;

const Home = lazy(() => import(/* webpackChunkName: "pageHome" */'pages/home'));
const About = lazy(() => import(/* webpackChunkName: "pageAbout" */'pages/about'));

const getRoutes = function getRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  );
};

export default getRoutes;
