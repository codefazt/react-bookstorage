import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from '../pages/Login';
import Menu from '../pages/Menu';

function Routers() {
    return (
        <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/menu" component={Menu}/>
        </Switch>
      </BrowserRouter>
    );
  }
  
  export default Routers;