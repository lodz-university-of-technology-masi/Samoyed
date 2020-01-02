import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home/Home";
import TestLoader from "../pages/TestLoader/TestLoader"
import NotFound from "../pages/NotFound/NotFound";
import Team from "../pages/Team/Team";
import SignUp from "../pages/SignUp/SignUp";
import Tests from "../pages/Tests/Tests";
import TestView from "../pages/TestView/TestView";
import TestCreate from "../pages/TestCreate/TestCreate";
import Profile from "../pages/Profile/Profile";
import Logout from "../components/Logout/Logout";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/team" exact component={Team} />
      <Route path="/login" exact component={SignUp} />
      <Route path="/tests" exact component={Tests} />
      <Route path="/test/create" exact component={TestCreate} />
      <Route path="/test/edit/:id" exact component={TestLoader} />
      <Route path="/test/:id" exact component={TestView} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/logout" exact component={Logout} />
      <Route component={NotFound} />
    </Switch>
  );
}
