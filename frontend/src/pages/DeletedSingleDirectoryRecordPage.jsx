import Header from '@components/header/Header.jsx';
import DeletedSingleDirectoryRecordTable from "@components/home/deleted/DeletedSingleDirectoryRecordTable";
import { useParams, useLocation, useNavigate } from "@solidjs/router";

function DeletedSingleDirectoryRecordPage() {
  const location = useLocation();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <h2 class="text-2xl">{`${location.state.title} , owned by: ${location.state.owner}`}</h2>
        <DeletedSingleDirectoryRecordTable title={location.state.title} />
      </main>
    </div>
  )
}

export default DeletedSingleDirectoryRecordPage;
