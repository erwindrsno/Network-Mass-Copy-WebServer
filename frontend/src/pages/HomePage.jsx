import DeletedEntryRecordTable from '../components/home/deleted/DeletedEntryRecordTable.jsx';
import EntryRecordTable from '../components/home/EntryRecordTable.jsx';
import Header from '@components/header/Header.jsx';
import { useLocation, useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';


function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <button onClick={() => navigate("/home/deleted_entry")} class="self-end text-gray-400 font-light text-sm hover:underline cursor-pointer">View deleted entries &gt</button>
        <EntryRecordTable />
      </main>
    </div >
  )
}

export default HomePage;
