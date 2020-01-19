import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Team from "../pages/Team/Team";
import SignUp from "../pages/SignUp/SignUp";
import Logout from "../components/Logout/Logout";
import { useSelector } from "react-redux";
import Evaluation from "../components/Evaluation/Evaluation";

const TestCreate = React.lazy(() => {
  return import("../pages/TestCreate/TestCreate");
});

const Tests = React.lazy(() => {
  return import("../pages/Tests/Tests");
});

const SolvedTests = React.lazy(() => {
  return import("../pages/SolvedTests/SolvedTests");
});

const SolvedTestsView = React.lazy(() => {
  return import("../pages/SolvedTestView/SolvedTestView");
});

const TestLoader = React.lazy(() => {
  return import("../pages/TestLoader/TestLoader");
});

const TestView = React.lazy(() => {
  return import("../pages/TestView/TestView");
});

const Profile = React.lazy(() => {
  return import("../pages/Profile/Profile");
});

const Routes = props => {
  const isLogged = useSelector(state => state.isLogged);

  let routes = (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/team" component={Team} />
      <Route path="/login" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );

  if (isLogged) {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/team" component={Team} />
        <Route path="/tests" render={props => <Tests {...props} />} />
        <Route
          path="/test/create"
          render={props => <TestCreate {...props} />}
        />
        <Route
          path="/test/edit/:id"
          render={props => <TestLoader {...props} />}
        />
        <Route path="/test/:id" render={props => <TestView {...props} />} />
        <Route
          path="/solvedtests/:id"
          render={props => <SolvedTestsView {...props} />}
        />
        <Route
          path="/solvedtests"
          render={props => <SolvedTests {...props} />}
        />
        <Route
          path="/evaluate/:id"
          render={props => <Evaluation {...props} />}
        />
        <Route path="/profile" render={props => <Profile {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return <Suspense fallback={<p>Ładowanie...</p>}>{routes}</Suspense>;
};

export default Routes;
