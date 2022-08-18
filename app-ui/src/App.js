import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import TrackPage from './pages/TrackPage.js';


function App() {  
  return (
    <div className="App">
      <Router>
        <Route path = "/" exact>
          <HomePage />
        </Route>
        <Route path = "/TrackPage" exact>
          <TrackPage />
        </Route>
      </Router>
  </div>
  );
}

export default App;
