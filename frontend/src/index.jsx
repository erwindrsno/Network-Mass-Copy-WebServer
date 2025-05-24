/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import 'solid-devtools';

import toast, { Toaster } from 'solid-toast';

import './index.css';

import LoginPage from "@pages/LoginPage";
import HomePage from "@pages/HomePage";
import CopyOxamPage from "@pages/CopyOxamPage";
import CopyPage from '@pages/CopyPage';
import ComputerPage from '@pages/admin/ComputerPage';
import AddComputerPage from '@pages/admin/AddComputerPage';
import UserPage from '@pages/admin/UserPage';
import AddUserPage from '@pages/admin/AddUserPage'; '@pages/admin/AddUserPage';
import SingleEntryRecordPage from '@pages/SingleEntryRecordPage';
import SingleDirectoryRecordPage from "@pages/SingleDirectoryRecordPage";
import DeletedSingleEntryRecordPage from '@pages/DeletedSingleEntryRecordPage';
import AddDirectoryPerEntry from '@pages/AddDirectoryPerEntry';
import PingBoardPage from '@pages/PingBoardPage';

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
            <Route path="/deleted_entry">
              <Route path="/" component={() => ProtectedRouteWrapper(HomePage)} />
              <Route path="/:entry_id" component={() => ProtectedRouteWrapper(DeletedSingleEntryRecordPage)} />
            </Route>
            <Route path="/copy-oxam" component={() => ProtectedRouteWrapper(CopyOxamPage)} />
            <Route path="/copy" component={() => ProtectedRouteWrapper(CopyPage)} />
            <Route path="/entry/:entry_id">
              <Route path="/" component={() => ProtectedRouteWrapper(SingleEntryRecordPage)} />
              <Route path="/directory/:dir_id" component={() => ProtectedRouteWrapper(SingleDirectoryRecordPage)} />
              <Route path="add" component={() => ProtectedRouteWrapper(AddDirectoryPerEntry)} />
            </Route>
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
