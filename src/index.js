/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Ennoble Studios (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Ennoble Studios

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./modules";
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "layouts/Login.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/css/material-dashboard-react.css?v=1.8.0";
require("dotenv").config();

const hist = createBrowserHistory();
const store = createStore(allReducers);
ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/rtl" component={RTL} />
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
