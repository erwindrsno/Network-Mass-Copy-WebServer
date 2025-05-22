import DeletedEntryRecordTable from '../components/home/deleted/DeletedEntryRecordTable.jsx';
import EntryRecordTable from '../components/home/EntryRecordTable.jsx';
import Header from '../components/header/Header.jsx';
import { useLocation, useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';


function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDeletedView = () => location.pathname.endsWith("/deleted_entry");

  const toggleDeletedView = () => {
    navigate(isDeletedView() ? "/home" : "/home/deleted_entry", { replace: false });
  };

  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <Show when={!isDeletedView()}>
          <button onClick={() => navigate("/home/deleted_entry")} class="self-end text-gray-400 font-light text-sm hover:underline cursor-pointer">View deleted entries &gt</button>
        </Show>
        <Show when={isDeletedView()} fallback={<EntryRecordTable />}>
          <DeletedEntryRecordTable />
        </Show>
      </main>
    </div >
  )
}

export default HomePage;
