import DeletedEntryRecordTable from '@components/home/deleted/DeletedEntryRecordTable.jsx';
import Header from '@components/header/Header.jsx';
import { useLocation, useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // const isDeletedView = () => location.pathname.endsWith("/deleted_entry");

  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <DeletedEntryRecordTable />
      </main>
    </div >
  )
}

export default HomePage;
