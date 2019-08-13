import React from 'react';

import  {BrowserRouter as Router, Route,Switch} from  'react-router-dom';
import Login from "./pages/login";
import Admin from "./pages/admin";
import './App.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/login'><Login/></Route>
        <Route path='/'><Admin/></Route>
      </Switch>
    </Router>
  );
}

export default App;
