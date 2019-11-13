import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Team from "../pages/Team/Team";
import SignUp from "../pages/SignUp/SignUp";
import Tests from "../pages/Tests/Tests";
import TestView from "../pages/TestView/TestView";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/team" exact component={Team} />
      <Route path="/login" exact component={SignUp} />
      <Route path="/tests" exact component={Tests} />
      <Route path="/test/:id" exact component={TestView} />
      <Route component={NotFound} />
    </Switch>
  );
}
