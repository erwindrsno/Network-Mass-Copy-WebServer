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
import AddComputer from './pages/admin/AddComputer.jsx';
import AddUser from './pages/admin/AddUser.jsx';

import ProtectedRouteWrapper from './components/utils/ProtectedRouteWrapper.jsx';
import { AuthContextProvider } from './components/utils/AuthContextProvider.jsx';

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
    <AuthContextProvider>
        <Router>
            <Route path="/" component={Login} />
            <Route path="/home">
              <Route path="/" component={() => ProtectedRouteWrapper(Home)} />
              <Route path="/copy-oxam" component={() => ProtectedRouteWrapper(CopyOxam)} />
              <Route path="/copy" component={() => ProtectedRouteWrapper(Copy)} />
            </Route>
            
            <Route path="/admin">
              <Route path="/computer">
                <Route path="/" component={() => ProtectedRouteWrapper(Computer)} />
                <Route path="/add" component={() => ProtectedRouteWrapper(AddComputer)} />
              </Route>
              <Route path="/user">
                <Route path="/" component={() => ProtectedRouteWrapper(User)} />
                <Route path="/add" component={() => ProtectedRouteWrapper(AddUser)} />
              </Route>
            </Route>
        </Router>
    </AuthContextProvider>
    ),
    wrapper
);
