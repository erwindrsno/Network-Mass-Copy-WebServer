/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import 'solid-devtools';

import './index.css';
// import App from './App';

import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import CopyOxam from './pages/CopyOxam.jsx';
import Copy from './pages/Copy.jsx';

import Computer from './pages/admin/Computer.jsx';
import User from './pages/admin/User.jsx';

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
            <Route path="/login"login component={Login}/>
            <Route path="/home" component={Home}/>
            <Route path="/copy-oxam" component={CopyOxam}/>
            <Route path="/copy" component={Copy}/>
            <Route path="/admin">
                <Route path="/computer" component={Computer}/>
                <Route path="/user" component={User}/>
            </Route>
        </Router>
    ),
    wrapper
);
