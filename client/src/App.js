import React,{Fragment} from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Landing from './components/Layout/Landing'
import Register from './components/Auth/Register';
import Login from './components/Auth/Login'

import './App.css';

const App=()=> (
  <Router>
<Fragment>
  <Navbar/>
<Route exact path="/" component={Landing}/>
<section className="container">
<Switch>
<Route exact path="/register" component={Register}/>
<Route exact path="/login" component={Login}/>
</Switch>
</section>

<Route exact path="/" component={Landing}/>
  </Fragment>
  </Router>
)
export default App;
