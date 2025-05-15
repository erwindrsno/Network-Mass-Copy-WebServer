/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import 'solid-devtools';

import toast, { Toaster } from 'solid-toast';

import './index.css';
// import App from './App';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CopyOxamPage from './pages/CopyOxamPage.jsx';
import CopyPage from './pages/CopyPage.jsx';

import ComputerPage from './pages/admin/ComputerPage.jsx';
import UserPage from './pages/admin/UserPage.jsx';
import AddComputerPage from './pages/admin/AddComputerPage.jsx';
import AddUserPage from './pages/admin/AddUserPage.jsx';
import SingleEntryRecordPage from './pages/SingleEntryRecordPage';
import PingBoardPage from "./pages/PingBoardPage.jsx";

import ProtectedRouteWrapper from './components/utils/ProtectedRouteWrapper.jsx';
import { AuthContextProvider } from './components/utils/AuthContextProvider.jsx';
import { WebSocketContextProvider } from './components/utils/WebSocketContextProvider';

const wrapper = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

if (!wrapper) {
  throw new Error("wrapper div not found")
}

render(
  () => (
    <AuthContextProvider>
      <WebSocketContextProvider>
        <Toaster />
        <Router>
          <Route path="/" component={LoginPage} />
          <Route path="/home">
            <Route path="/" component={() => ProtectedRouteWrapper(HomePage)} />
            <Route path="/copy-oxam" component={() => ProtectedRouteWrapper(CopyOxamPage)} />
            <Route path="/copy" component={() => ProtectedRouteWrapper(CopyPage)} />
            <Route path="/entry/:id" component={() => ProtectedRouteWrapper(SingleEntryRecordPage)}></Route>
            <Route path="/ping_board" component={() => ProtectedRouteWrapper(PingBoardPage)} />
          </Route>

          <Route path="/admin">
            <Route path="/computer">
              <Route path="/" component={() => ProtectedRouteWrapper(ComputerPage)} />
              <Route path="/add" component={() => ProtectedRouteWrapper(AddComputerPage)} />
            </Route>
            <Route path="/user">
              <Route path="/" component={() => ProtectedRouteWrapper(UserPage)} />
              <Route path="/add" component={() => ProtectedRouteWrapper(AddUserPage)} />
            </Route>
          </Route>
        </Router>
      </WebSocketContextProvider>
    </AuthContextProvider >
  ),
  wrapper
);
