import Header from '@components/header/Header.jsx';
import DeletedSingleEntryRecordTable from "@components/home/deleted/DeletedSingleEntryRecordTable.jsx";
import { useParams, useLocation, useNavigate } from "@solidjs/router";

function DeletedSingleEntryRecordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state.title;
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <div class="flex justify-between">
          <h2 class="text-2xl">{title}</h2>
        </div>
        <DeletedSingleEntryRecordTable title={title} />
      </main>
    </div >
  )
}

export default DeletedSingleEntryRecordPage;
