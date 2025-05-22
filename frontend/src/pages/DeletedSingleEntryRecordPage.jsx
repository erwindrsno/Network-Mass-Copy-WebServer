import Header from '../components/header/Header.jsx';
import DeletedSingleEntryRecordTable from '../components/home/deleted/DeletedSingleEntryRecordTable.jsx';
import { useParams, useLocation } from "@solidjs/router";

function DeletedSingleEntryRecordPage() {
  const location = useLocation();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <h2 class="text-2xl">{location.state.title}</h2>
        <DeletedSingleEntryRecordTable title={location.state.title} />
      </main>
    </div>
  )
}

export default DeletedSingleEntryRecordPage;
