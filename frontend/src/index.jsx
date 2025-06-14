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
import AddDirectoryPerEntry from '@pages/AddDirectoryPerEntry';
import StatusBoardPage from '@pages/StatusBoardPage';
import DeletedEntryRecordPage from '@pages/DeletedEntryRecordPage.jsx';
import DeletedSingleEntryRecordPage from '@pages/DeletedSingleEntryRecordPage.jsx';
import DeletedSingleDirectoryRecordPage from "@pages/DeletedSingleDirectoryRecordPage";

import ProtectedRouteWrapper from '@utils/ProtectedRouteWrapper.jsx';
import { AuthContextProvider } from '@utils/AuthContextProvider.jsx';
import { SseContextProvider } from '@utils/SseContextProvider';

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
      <SseContextProvider>
        <Toaster position="bottom-right" />
        <Router>
          <Route path="/" component={LoginPage} />
          <Route path="/home">
            <Route path="/" component={() => ProtectedRouteWrapper(HomePage)} />
            <Route path="/copy-oxam" component={() => ProtectedRouteWrapper(CopyOxamPage)} />
            <Route path="/copy" component={() => ProtectedRouteWrapper(CopyPage)} />
            <Route path="/entry/:entry_id">
              <Route path="/" component={() => ProtectedRouteWrapper(SingleEntryRecordPage)} />
              <Route path="/directory/:dir_id" component={() => ProtectedRouteWrapper(SingleDirectoryRecordPage)} />
              <Route path="add" component={() => ProtectedRouteWrapper(AddDirectoryPerEntry)} />
            </Route>
            <Route path="/deleted_entry">
              <Route path="/" component={() => ProtectedRouteWrapper(DeletedEntryRecordPage)} />
              <Route path="/entry/:entry_id">
                <Route path="/" component={() => ProtectedRouteWrapper(DeletedSingleEntryRecordPage)} />
                <Route path="/directory/:dir_id" component={() => ProtectedRouteWrapper(DeletedSingleDirectoryRecordPage)} />
              </Route>
            </Route>
            <Route path="/status_board" component={() => ProtectedRouteWrapper(StatusBoardPage)} />
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
      </SseContextProvider>
    </AuthContextProvider >
  ),
  wrapper
);
