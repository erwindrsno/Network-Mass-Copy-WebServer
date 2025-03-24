/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import './index.css';
import App from './App';

import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import LoginTest from './pages/LoginTest.jsx';

const wrapper = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

if(!wrapper){
    throw new Error("wrapper div not found")
}
render(
    () => (
        <Router>
            <Route path="/" component={Login} />
            <Route path="/home" component={Home}/>
            <Route path="test" component={LoginTest}/>
        </Router>
    ),
    wrapper
);
