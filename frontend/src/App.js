import React from "react";

import "./App.css";
import Routes from "./routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import NavMenu from "./pages/NavMenu/NavMenu";

function App(props) {
  return (
    <Provider store={store}>
	  <NavMenu />
      <div className="container py-4">
        <Routes />
      </div>
    </Provider>
  );
}

export default App;
